import express from "express";

// Create an express app
const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000");
});