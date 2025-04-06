import { defineConfig } from 'tsup';

import pkgJson from './package.json';

export default defineConfig({
  entry: ['src-fake/build.ts'],
  outDir: 'dist-fake',
  format: 'cjs',
  target: 'node20',
  sourcemap: true,
  clean: true,
  external: Object.keys(pkgJson.dependencies).concat(
    Object.keys(pkgJson.devDependencies)
  ),
  tsconfig: 'src-fake/tsconfig.json',
});
