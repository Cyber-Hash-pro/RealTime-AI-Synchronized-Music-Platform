require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db.js');
const {initSocketServer} = require('./src/sockets/socket.server');
const http = require('http');

const httpServer = http.createServer(app);
// Connect to the database
connectDB();

initSocketServer(httpServer);




httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});