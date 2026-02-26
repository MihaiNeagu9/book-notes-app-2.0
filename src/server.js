import app from "./app.js";
import express from "express";

const PORT = process.env.APP_PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.listen(PORT, () => {
    console.log(`Book notes app listening on http://localhost:${PORT}`);
});