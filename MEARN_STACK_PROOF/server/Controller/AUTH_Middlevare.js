import jwt from "jsonwebtoken"

export function requireAuth(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_Secerate")
    req.userId = decoded.userId || decoded.id
    return next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" })
  }
}