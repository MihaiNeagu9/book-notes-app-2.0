import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export function attachCurrentUser(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.auth_token;

  if (!token) {
    res.locals.currentUser = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    res.locals.currentUser = req.user;
  } catch {
    res.locals.currentUser = null;
  }

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }

  return next();
}

export function signAuthToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name },
    JWT_SECRET,
    { subject: String(user.id), expiresIn: "7d" }
  );
}
