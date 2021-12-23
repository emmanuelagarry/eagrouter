/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
      public: {url: '/', static: true},
      src: {url: '/dist'},
    },
    plugins: [
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
  