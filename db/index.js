const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const connectionString = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected successfully');
});

module.exports = mongoose;