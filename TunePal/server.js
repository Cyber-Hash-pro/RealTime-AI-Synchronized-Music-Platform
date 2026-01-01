const app = require('./src/app.js')
require('dotenv').config();
const http = require('http');
const{ initSocketServer} = require('./src/sockets/sockets.server.js');
const httpServer = http.createServer(app);
initSocketServer(httpServer);
const { connectDB } = require('./src/db/db.js');

// Connect to MongoDB
connectDB();

// Start the server






httpServer.listen(3003, () => {
console.log(`Server is running on http://localhost:3003`);
})