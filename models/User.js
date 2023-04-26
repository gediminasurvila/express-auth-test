const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passcode: {
    type: String
  },
  passcodeExpiration: {
    type: Date
  },
  googleId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  blocked: {
    type: Boolean,
    default: false,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
