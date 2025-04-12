// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['src-fake/**', '**/*.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          /* 
           This rule is to prevent inline type import for `.dto` files, e.g.

           `import { type CreateUserDto } from './user.dto';`
          */
          selector:
            'ImportDeclaration[source.value=/.*\\.dto$/] > ImportSpecifier[importKind=type]',
          message:
            'Type imports from .dto files are not allowed. Use regular imports instead.',
        },
        {
          /* 
           This rule is to prevent type import for `.dto` files, e.g.

           `import type { CreateUserDto } from './user.dto';`
          */
          selector:
            'ImportDeclaration[source.value=/.*\\.dto$/][importKind=type]',
          message:
            'Type imports from .dto files are not allowed. Use regular imports instead.',
        },
      ],
    },
  }
);
