import app from "./app.js";

const PORT = process.env.APP_PORT || 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(PORT, () => {
    console.log(`Book notes app listening on http://localhost:${PORT}`);
});