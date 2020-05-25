import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import * as url from 'url';
import WebSocket, { Server } from 'ws';
import { MessagePayload, ChatMessage } from './chat.type';
import { ChatService } from './chat.service';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private roomParticipants = new Map<string, WebSocket[]>();

  private async registerClient(roomId: string, client: WebSocket) {
    const currentClients = this.roomParticipants.get(roomId);

    if (currentClients) {
      await this.broadcast(roomId, {
        type: 'System',
        message: 'New user joined',
      });
      currentClients.push(client);
      await this.sendMessage(client, {
        type: 'System',
        message: `There are ${currentClients.length - 1} users online.`,
      });
    } else {
      this.roomParticipants.set(roomId, [client]);
      await this.sendMessage(client, {
        type: 'System',
        message: `There are 0 user online.`,
      });
    }

    client.on('message', async rawData => {
      const message = this.parseMsg(rawData);
      if (message) {
        const savedMessage = await this.chatService.addMessage(roomId, message);
        this.broadcast(roomId, {
          type: 'User',
          message: message.content,
          data: savedMessage,
        });
      }
    });
  }

  private cleanupClient(client: WebSocket) {
    this.roomParticipants.forEach((value, key) => {
      const clientIndex = value.indexOf(client);
      if (clientIndex > -1) {
        value.splice(clientIndex, 1);
      }
      if (value.length === 0) {
        this.roomParticipants.delete(key);
      }
    });
  }

  // TODO: handle authentication
  handleConnection(client: WebSocket, msg: IncomingMessage) {
    if (msg.url) {
      const { query } = url.parse(msg.url, true);
      const roomId = query && query.roomId;

      if (roomId) {
        if (Array.isArray(roomId)) {
          roomId.forEach(id => this.registerClient(id, client));
        } else {
          this.registerClient(roomId, client);
        }
      }
    }
  }

  handleDisconnect(client: WebSocket) {
    this.cleanupClient(client);
  }

  private sendMessage(client: WebSocket, message: MessagePayload) {
    const payload = JSON.stringify(message);
    return new Promise((fulfill, reject) => {
      client.send(payload, err => {
        if (err) {
          return reject(err);
        }
        return fulfill();
      });
    });
  }

  private broadcast(roomId: string, message: MessagePayload): Promise<unknown> {
    const participants = this.roomParticipants.get(roomId);

    if (participants) {
      return Promise.all(
        participants.map(participant => this.sendMessage(participant, message))
      );
    }
    return Promise.resolve();
  }

  private parseMsg(message: WebSocket.Data): ChatMessage | undefined {
    try {
      return JSON.parse(message as string);
    } catch (err) {
      console.error(err);
    }
  }
}
