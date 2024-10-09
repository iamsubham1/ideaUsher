const mongoose = require('mongoose');

const connectToDb = async (MONGODB_URI) => {
    try {


        const uri = "mongodb+srv://das1998lipun:UpDpuPM4XuJE3G88@cluster0.goopw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

        const connection = await mongoose.connect(uri);
        console.log('Connected to database');

        connection.connection.on('open', () => {
            console.log('Connection is open');
        });

        connection.connection.on('error', (err) => {
            console.error('Connection error:', err);
        });
    } catch (error) {
        console.error('Could not connect to database:', error);
    }
};

module.exports = { connectToDb }