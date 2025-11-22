require('dotenv').config(); // Always at the top
const app = require('./src/app.js')
const DbConnect = require('./src/db/db.js');
const connectRabbitMQ = require('./src/broker/rabbit.js');

// Connect to the database
DbConnect();

// Connect to RabbitMQ
connectRabbitMQ.connect();

app.listen(process.env.PORT, () => {
  console.log(`Authentication service running on port ${process.env.PORT}`);
});