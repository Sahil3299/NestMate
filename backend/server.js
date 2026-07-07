const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');
const { setupSocket } = require('./services/socket');

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  setupSocket(io);

  server.listen(env.PORT, () => {
    logger.info(`NestMate server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
