const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // ye package is used to parse cookies 

const onlineUsers = new Map();
const room = new Map();

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
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
        // console.log("Decoded token:", decode);
        socket.user = decode; // Attach user info to socket object // req.user= decode noramal api socket api socket.user = decode this 
        next();
    }catch(err){
        return next(new Error("Authentication error: Invalid token", err));
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.email}`);
    socket.join(socket.user.id) // room ki id is user ki id 
    // scoket.jon kya karta hae method user ko connect  or join karvata hae room se 
    // agar room nahi hova to too create kar dega 
    onlineUsers.set(socket.user.email,socket.id); // map me add kar diya user ko
    socket.on("check-user-online", (email) => {
        console.log("Checking online status for:", email);
  const isOnline = onlineUsers.has(email); // agar value true email and ture  and agar email nahi hae too false
  socket.emit("user-status", {
    email,
    isOnline,
  });
});

    socket.on('play',(data)=>{
        // console.log('Play event received on server with data:', data);
        const musicId= data.musicId 
        // broadcast means sabko send kar dega except sender ko 
        // broadcast.to kya karta hae specific room me send kar dega user ko 
          socket.broadcast.to(socket.user.id).emit('play', {musicId}) // ye sirf usi user ko send karega jiska id hae
        //   broadcast → send to others only (not the sender)
       // .to(socket.user.id) → send only to that room (that user)
    })

    socket.on('createroom',({roomId, password })=>{
        if(room.has(roomId)){
            socket.emit('roomError',{success:false, message:'Room ID already exists'});
            return;
        }
        room.set(roomId ,{password , users:[socket.user.id]})
        // console.log("Room ", room);
        socket.join(roomId) // jo user room create karega wo usme join ho jayega default like admin
         socket.emit("roomCreated", roomId);
    })
    // jab koi user room join karega like dusra user
    socket.on('joinroom',({roomId, password})=>{
        const rom =  room.get(roomId);
        if(!rom){
            socket.emit('roomError',{success:false, message:'Room does not exist'});
            return;
        }
        if(rom.password !== password){
            socket.emit('roomError',{success:false, message:'Incorrect password'});
            return;
        }
                if (!rom.users.includes(socket.user.id)) {
    rom.users.push(socket.user.id);
}


        socket.join(roomId);
        socket.emit("roomJoined", roomId);
        // console.log("The room state after joining: ",room)

    })
    socket.on('send-audio',({roomId, 
  src, 
  senderDetails,
  thumbnail, 
  currentTime, 
  volume })=>{
// broadcast to sabko send kar dega except sender ko
//  console.log("Audio data received for room:",  src , senderDetails, roomId, thumbnail, currentTime, volume);


        socket.broadcast.to(roomId).emit('receive-audio', {
             src,
             senderDetails,
    thumbnail,
    currentTime,
    volume
        }); 
    })




  




    socket.on("disconnect", () => {
        socket.leave(socket.user.id) // hamre resouce kam katam ho esliye 
        onlineUsers.delete(socket.user.email);
          room.forEach((value, key) => {
        const users = value.users;
        const index = users.indexOf(socket.user.id);

        if (index !== -1) {
            users.splice(index, 1); // remove user
            
            // If room empty → delete it
            if (users.length === 0) {
                room.delete(key);
                console.log("Room deleted:", key);
            } else {
                room.set(key, value); // ensure updated
            }
        }
    });
    console.log(`User disconnected: ${socket.user.email}`);
    console.log('The room state: ',room)



        socket.broadcast.emit("user-offline", {
            email: socket.user.email,
            status: "offline",
          });

    })
})


}
module.exports = {initSocketServer};
// 30 vaildation to create roorm and audo emti after 30 min gernate a new room id