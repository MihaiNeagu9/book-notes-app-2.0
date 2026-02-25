import app from "./app.js";

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Book notes app listening on port ${process.env.APP_PORT}`);
});