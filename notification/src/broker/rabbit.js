const amqplib = require('amqplib')


let channel, connection;

const connect = async () => {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    // Data queue me danle kiyle and nikanle ke liye ham channecl create karte hae
console.log('Connected to RabbitMQ');

}   
const publicToQueue = async(queueName,data) => {
  await   channel.assertQueue(queueName,{ durable:true})// durable:true data exit agar dursi service down ho jati hae to bhi data rahega
  channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data))) 
  console.log(`Message sent to queue ${queueName}`);
     // durable ka matlab hae ki agar rabbitmq server down ho jata hae to bhi ye queue delete nahi hogi

}
const subscribeToQueue = async(queueName,callback )=>{ // queue se DAta nikalne ke liye
    await channel.assertQueue(queueName,{durable:true})
    channel.consume(queueName,async (msg)=>{ // msg me data aayega jo queue me hoga
    await callback(JSON.parse(msg.content.toString())) // msg.content me data hota hae jo buffer me hota hae to usko string me convert karna padta hae fir json me parse karna padta hae
    await channel.ack(msg) 
     // ack - acknowledgement queue se data jane ke baad mene apna kam kar diya hae bata hae kyu patat hae ki kam huva hae kyu ki kyu uus message ko delete kar sakhe 
     // jabtak queue ko ack nahi karoge tabtak wo message queue me rahega delete nahi hoga
      })
}


module.exports=  {
    subscribeToQueue,
    connect,
    publicToQueue
}
