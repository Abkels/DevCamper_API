const mongoose = require('mongoose');
const DB = 'monogodb://localhost/devCamper'

const connectDB = async () => {
    // try {
    //     const connect = await mongoose.connect(DB);
    //     console.log(`database connected ${connect.connection.host}`)
    // } catch (error) {
    //     console.log(error.name)
    // }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;

 