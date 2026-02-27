export function renderRegister(req, res) {
    return res.render("register", {
        error: null,
        form: { email: "" }
    });
}

export function renderLogin(req, res) {
    return res.render("login", {
        error: null,
        form: { email: "" }
    });
}