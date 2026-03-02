import bcrypt from "bcrypt";
import { signAuthToken } from "../middlewares/auth.middleware.js";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export function renderRegister(req, res) {
    return res.render("register", {
        error: null,
        form: { name: "", email: "" }
    });
}

export async function register(req, res) {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim();
    const password = String(req.body.password ?? ""); 

    if (!name || !email || password.length < 6) {
        return res.status(400).render("register", {
            error: "Name, email and a password of at least 6 characters are required.",
            form: { name, email }
        });
    }

    try {
        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(400).render("register", {
                error: "This email is already in use.",
                form: { name, email }
            });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const user = await createUser({ name, email, password_hash });
        const token = signAuthToken(user);

        res.cookie("auth_token", token, COOKIE_OPTIONS);
        return res.redirect("/");

    } catch (error) {
        if (error?.code === "23505") {
            return res.status(400).render("register", {
            error: "This email is already in use.",
            form: { name, email }
            });
        }

        console.error("Failed to register:", error.message);
        return res.status(500).send("Failed to register.");
    }
}

export function renderLogin(req, res) {
    return res.render("login", {
        error: null,
        form: { email: "" }
    });
}

export async function login(req, res) {
    const email = String(req.body.email ?? "").trim();
    const password = String(req.body.password ?? "");

    if (!email || !password) {
        return res.status(400).render("login", {
            error: "Email and password are required.",
            form: { email }
        });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
        return res.status(401).render("login", {
            error: "User not found.",
            form: { email }
        });
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
        return res.status(401).render("login", {
            error: "Invalid credentials.",
            form: { email }
        });
        }

        const token = signAuthToken(user);
        res.cookie("auth_token", token, COOKIE_OPTIONS);
        return res.redirect("/");
    } catch (error) {
        console.error("Failed to login:", error.message);
        return res.status(500).send("Failed to login.");
    }
}