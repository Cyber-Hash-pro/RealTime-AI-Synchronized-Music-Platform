const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

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
            console.log(`User connected: ${socket.user.id}`);


            
            socket.on('disconnect',()=>{
                console.log(`User disconnected: ${socket.user.id}`);
            });
        });

}
module.exports={initSocketServer};