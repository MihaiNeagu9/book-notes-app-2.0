import express from "express";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";

const PORT = process.env.APP_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use(authRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.post("/login", (req, res) => {
    const email = String(req.body.email ?? "").trim();
    const password = String(req.body.password ?? "");
    
    if (!email || !password) {
        return res.status(400).render("login", {
            error: "Email and password are required.",
            form: { email }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Book notes app listening on http://localhost:${PORT}`);
});