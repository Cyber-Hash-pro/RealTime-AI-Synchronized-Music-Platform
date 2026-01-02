const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Messages = require('../model/chat.model.js')
const{ agent} = require('../agent/agent.js');
const initSocketServer = (httpServer)=>{
        const io = new Server(httpServer,{ 
            cors:{
                origin:"http://localhost:5173",
                credentials:true

            }
        })


        io.use((socket,next)=>{
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const {token } = cookies;
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
          

           socket.on("ai-message", async (data) => {
  try {
    // console.log(`Received AI message from ${socket.user.id}:`, data.message);

    // await new Messages({
    //   userId: socket.user.id,
    //   messages: { role: "user", message: data.message }
    // }).save();
    console.log('token ',socket.token);

    const agentResponse = await agent.invoke({
      messages: [{ role: "user", content: data.message }],
      metadata: { token: socket.token }
    });

    const lastMessage =
      agentResponse.messages[agentResponse.messages.length - 1].content;

    socket.emit("ai-response", { message: lastMessage });

    // await new Messages({
    //   userId: socket.user.id,
    //   messages: { role: "ai", message: lastMessage }
    // }).save();

  } catch (err) {
    console.error(err);
    socket.emit("ai-response", {
      message: "AI Error — please try again later."
    });
  }
});


            
            socket.on('disconnect',()=>{
                console.log(`User disconnected: ${socket.user.id}`);
            });
        });

}
module.exports={initSocketServer};