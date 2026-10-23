import jwt from "jsonwebtoken"
import User from "../models/user.js"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"

const setAuthCookie = (res, payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" })
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  })
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const normalizedEmail = email.toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" })
    }

    const newUser = await User.create({ name, email: normalizedEmail, password })
    setAuthCookie(res, { userId: newUser._id.toString(), email: newUser.email })

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    })
  } catch (error) {
    console.error("Register error:", error)
    return res.status(500).json({ message: "Something went wrong during registration" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const normalizedEmail = email.toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    setAuthCookie(res, { userId: user._id.toString(), email: user.email })

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Something went wrong during login" })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ message: "Something went wrong during logout" })
  }
}

export async function me(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Me error:", error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}