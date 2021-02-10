/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
      public: {url: '/', static: true},
      src: {url: '/dist'},
    },
    plugins: [
    //   '@snowpack/plugin-babel',
    //   '@snowpack/plugin-dotenv',
    //   '@snowpack/plugin-typescript',
    ],
    devOptions: {
      /* ... */
      hmr: true,

      
    },
    routes: [
      {"match": "routes", "src": ".*", "dest": "/index.html"}
  ],
    buildOptions: {
      /* ... */
  
    },

    alias: {
      /* ... */
    },
    exclude: [
        '/node_modules/**/*',
        '/lib/**/*'
    ]
  };
  