const app = require('./src/app.js')
require('dotenv').config();

console.log(process.env.MONGODB_URI);
console.log(process.env.JWT_SECRET);
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);
console.log(process.env.REFRESH_TOKEN_SECRET);
console.log(process.env.EMAIL_USER);

app.listen(3001,()=>{
    console.log('Server Is Running Port 3001')
})