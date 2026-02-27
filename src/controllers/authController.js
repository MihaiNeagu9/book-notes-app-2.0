export function renderLogin(req, res) {
    return res.render("login", {
        error: null,
        form: { email: "" }
    });
}