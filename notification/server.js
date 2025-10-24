const app = require('./src/app.js')
require('dotenv').config();
const {connect} = require('./src/broker/rabbit.js')
const listern = require('./src/broker/listner.js')
connect().then(()=>{
    listern()
    console.log('Connect ot RabbitMQ')
}).catch((error)=>{
    console.log('Not Connect amqpli')
})


app.listen(3001,()=>{
    console.log('Server Is Running Port 3001')
})