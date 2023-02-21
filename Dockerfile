FROM node:16 as builder

RUN apt-get install libcurl4

RUN corepack prepare pnpm@7.27.0 --activate && corepack enable

RUN mkdir /app
WORKDIR /app

# ENV MONGOMS_DOWNLOAD_URL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.2.14.tgz
# ENV MONGOMS_VERSION 4.2.14
ENV MONGOMS_DOWNLOAD_DIR /app/mongodb-binaries

COPY pnpm-lock.yaml .

RUN pnpm fetch

COPY package.json .

RUN pnpm install --offline

COPY webpack.fake.config.js .
COPY index.html .
COPY images /app/images
COPY src-fake /app/src-fake

RUN pnpm run build:fake

RUN pnpm run generate

COPY . .

RUN pnpm run build

#######################################################################

FROM node:16 as deps

RUN corepack prepare pnpm@7.27.0 --activate && corepack enable

RUN mkdir /app
WORKDIR /app

# ENV MONGOMS_DOWNLOAD_URL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.2.14.tgz
# ENV MONGOMS_VERSION 4.2.14

COPY pnpm-lock.yaml .

RUN pnpm fetch --prod

COPY package.json .

RUN pnpm install --prod --offline

#######################################################################

FROM node:16

RUN apt-get install libcurl4

WORKDIR /app

COPY seed /app/seed
COPY package.json .
COPY --from=builder /app/build /app/build
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/mongodb-binaries /app/mongodb-binaries
COPY --from=deps /app/node_modules /app/node_modules

ENV NODE_ENV production
ENV MONGOMS_DOWNLOAD_DIR /app/mongodb-binaries
# ENV MONGOMS_DOWNLOAD_URL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.2.14.tgz
# ENV MONGOMS_VERSION 4.2.14
ENV MONGOMS_DEBUG 1

CMD ["npm", "start"]