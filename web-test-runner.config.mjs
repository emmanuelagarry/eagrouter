import { esbuildPlugin } from '@web/dev-server-esbuild';
export default {
    files: 'tests/*.spec.ts',
    concurrency: 10,
    nodeResolve: true,
    watch: true,
    plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
    // in a monorepo you need to set set the root dir to resolve modules
  };