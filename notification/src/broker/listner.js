const {subscribeToQueue} = require('./rabbit.js')
const sendEmail = require('../utils/email.js')

const listen = async()=>{
    await subscribeToQueue('user_created',async (data)=>{ 
        const { email,fullName } = data;
        // console.log("Email is ready to send ",data)
       const template = `
       <h1>Welcome to Our Service, ${fullName}!</h1>
       <p>We're excited to have you on board. If you have any questions, feel free to reach out.</p>
       <p>Best regards,<br/>The Team</p>
       `;
       await sendEmail(email,'Welcome to Our Service', 'Welcome!', template)
    }); 
}
module.exports = listen
