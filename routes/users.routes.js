const express = require("express")
const fs = require("fs")
const { v4: uuid } = require("uuid")
const upload = require("../middleware/upload.middleware")
const uniqueEmail = require("../middleware/uniqueEmail.middleware")
const cloudinary = require("../config/cloudinary.config")

const router = express.Router()

router.post("/signup", upload.single("profile"), uniqueEmail, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Profile image required" })
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })

    const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"))
    const newUser = {
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePic: result.secure_url
    }

    db.users.push(newUser)
    fs.writeFileSync("./db.json", JSON.stringify(db, null, 2))

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic
      }
    })
  } catch (err) {
    res.status(500).json({ error: "Cloudinary upload failed" })
  }
})

module.exports = router
