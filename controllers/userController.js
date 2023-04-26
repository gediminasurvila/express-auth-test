const User = require("../models/User");

const userController = {
  async get(req, res) {
    const users = await User.find({}, 'id email');
    res.json({ users: users});
  },
  create(req, res) {
    res.sendStatus(201);
  }
}

module.exports = userController;