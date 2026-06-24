let io = null;

const initSocket = (server, options = {}) => {
  try {
    // lazy require to avoid optional dependency errors during tests
    // eslint-disable-next-line global-require
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: {
        origin: (origin, callback) => callback(null, true),
        credentials: true,
      },
      ...options,
    });

    io.on("connection", (socket) => {
      // eslint-disable-next-line no-console
      console.log("Socket connected:", socket.id);

      socket.on("disconnect", () => {
        // eslint-disable-next-line no-console
        console.log("Socket disconnected:", socket.id);
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Socket.IO not available:", err.message);
    io = null;
  }
};

const getIo = () => io;

module.exports = {
  initSocket,
  getIo,
};
