const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Messages = require('../model/chat.model.js')
const agent = require('../agent/agent.js');
const initSocketServer = (httpServer)=>{
        const io = new Server(httpServer,{ 
            cors:{
                origin:"http://localhost:5173",
                credentials:true

            }
        })


        io.use((socket,next)=>{
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            // console.log(cookies);
            const {token } = cookies;
            console.log(token)
             if(!token){
                return next(new Error('Authentication error: No token provided'));
             }
             try{

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.user = decoded;
                socket.token = token;

                 next();
             }catch(err){
                return next (new Error ('Authentication error: Invalid token'));
             }

        })

        io.on('connection',(socket)=>{
            // console.log(`User connected: ${socket.user.id}`);
        // const userId = socket.user.id;
        // const name = socket.user.name;

            socket.on('ai-message',async(data)=>{
                console.log(`Received AI message from user ${socket.user.id}:`, data.message);
                    
                // Save message to database
                const newMessage = new Messages({
                    userId: socket.user.id,
                    messages: {
                        role: 'user',
                        message: data.message,
                    }
                });
                await newMessage.save();

                // Emit response back to client
                const agentmessage  = await agent.invoke({
                    messages:[{
                        role :'user',
                        content:data.message
                    }]
                    
                })
                console.log('Agent Message:', agentmessage);    
                socket.emit('ai-response', {
                    message: agentmessage,

                });
                const botReply = new Messages({
                    userId: socket.user.id,
                    messages: {
                        role: 'ai',
                        message:agentmessage
                    }
                });
                await botReply.save();

            })

            
            socket.on('disconnect',()=>{
                console.log(`User disconnected: ${socket.user.id}`);
            });
        });

}
module.exports={initSocketServer};