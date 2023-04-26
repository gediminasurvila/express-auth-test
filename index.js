require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/error");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
