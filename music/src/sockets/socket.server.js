const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // ye package is used to parse cookies 


function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
          credentials: true,
          
        }
    }); 
    io.use((socket, next) => {
       
        const cookies= cookie.parse(socket.handshake.headers.cookie || '');
        const token = cookies.token
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decode; // Attach user info to socket object // req.user= decode noramal api socket api socket.user = decode this 
        next();
    }catch(err){
        return next(new Error("Authentication error: Invalid token", err));
    }
});

io.on("connection", (socket) => {
    socket.join(socket.user.id) // room ki id is user ki id 
    // scoket.jon kya karta hae method user ko connect  or join karvata hae room se 
    // agar room nahi hova to too create kar dega 

    socket.on('play',(data)=>{
        const musicId= data.musicId 
        socket.broadcast.to(socket.user.id).emit('play', {musicId}) // ye sirf usi user ko send karega jiska id hae
    })

    socket.on("disconnect", () => {
        socket.leave(socket.user.id) // hamre resouce kam katam ho esliye 
    })
})


}
module.exports = {initSocketServer};