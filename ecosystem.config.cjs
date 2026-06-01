module.exports = {
  apps: [{
    name: 'hermes-blog',
    script: 'node',
    args: 'build/index.js',
    cwd: '/var/www/hermes-blog',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      HOST: '0.0.0.0',
      ORIGIN: 'https://lockbit.my.id',
    },
    instances: 1,
    max_memory_restart: '200M',
    watch: false,
    autorestart: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
