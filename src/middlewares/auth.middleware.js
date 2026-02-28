import jwt from "jsonwebtoken";

export function getJWTSecretOrThrow() {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
        const err = new Error("Missing JWT_SECRET");
        err.code = "CONFIG_ERROR";
        throw err;
    }
    return secret;
}

export function signAuthToken(user) {
    const JWT_SECRET = getJWTSecretOrThrow();
    return jwt.sign(
    { email: user.email, name: user.name },
    JWT_SECRET,
    { subject: String(user.id), expiresIn: "7d" }
    );
}