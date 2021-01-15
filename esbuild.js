require('esbuild').buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'out.js',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })