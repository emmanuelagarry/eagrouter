import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
export default {
    browsers: [playwrightLauncher({ launchOptions: { args: ['--no-sandbox'] } })],
    files: 'tests/*.spec.ts',
    concurrency: 10,
    nodeResolve: true,
    watch: true,
    plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
    // in a monorepo you need to set set the root dir to resolve modules
  };