module.exports = {
  apps : [
    {
      name: 'server',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
        EDUCATOPIA_FEATURED_EXERCISES: [
          '5e76a924b954eb4ef41c05e3',
          '5e76b03d1b8862538748dc50',
          '5e776c08a7d39a72aedceb6e',
          '5e776c7a95c6d072cc5df782',
        ].join(',')
      },
    },
  ],
}
