import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Protection middleware for private routes
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }

  return next();
}

// Convert the raw Cookie header into an object
function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

// Identifies the current user based on the JWT cookie
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

// Validates the JWT configuration and returns the secret key
export function getJWTSecretOrThrow() {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
        const err = new Error("Missing JWT_SECRET");
        err.code = "CONFIG_ERROR";
        throw err;
    }
    return secret;
}

// Creates the authentication JWT for the logged/registered user
export function signAuthToken(user) {
    const JWT_SECRET = getJWTSecretOrThrow();
    return jwt.sign(
    { email: user.email, name: user.name },
    JWT_SECRET,
    { subject: String(user.id), expiresIn: "7d" }
    );
}