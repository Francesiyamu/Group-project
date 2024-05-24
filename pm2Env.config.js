module.exports = {
    apps: [
      {
        name: 'Billy',
        script: './server.js', // Replace with the entry point of your application
        env: {
            NODE_ENV: 'development',
          },
        env_production: {
          NODE_ENV: 'production',
        },
        // Load .env file
        node_args: '-r dotenv/config',

      },
    ],
  };
  