const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db.json");

const uniqueEmailMiddleware = (req, res, next) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const userExists = db.users.some(u => u.email === req.body.email);
    if (userExists) return res.status(409).json({ error: "Email already exists" });
    next();
};

module.exports = uniqueEmailMiddleware;
