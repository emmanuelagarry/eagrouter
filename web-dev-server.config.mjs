import { esbuildPlugin } from '@web/dev-server-esbuild';
export default {
    open: true,
    nodeResolve: true,
    appIndex: 'index.html',
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: './src',
    watch: true,
    plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
  };

  