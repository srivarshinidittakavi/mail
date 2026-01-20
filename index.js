require("dotenv").config()
console.log(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
)

const express = require("express");
const usersRoutes = require("./routes/users.routes");

const app = express();
app.use(express.json());
app.use("/users", usersRoutes);

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
