const mongoose = require('mongoose');

const DbConnect = async () => {
    try {
        await mongoose.connect(process.env.Mongodb_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
module.exports = DbConnect;