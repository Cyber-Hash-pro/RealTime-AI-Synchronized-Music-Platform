const amqplib = require('amqplib')


let channel, connection;

const connect = async () => {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    // Data queue me danle kiyle and nikanle ke liye ham channecl create karte hae
console.log('Connected to RabbitMQ');

}   
const publicToQueue = (queueName,data) => {
    

}


module.exports=  {
    connect
}
