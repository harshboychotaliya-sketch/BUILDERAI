import { Router } from "express"
import { login, logout, me, register } from "../Controller/Authcontrolles.js"
import { requireAuth } from "../Controller/AUTH_Middlevare.js"

const Authroute = Router()

Authroute.post("/register", register)
Authroute.post("/login", login)
Authroute.post("/logout", logout)
Authroute.get("/me", requireAuth, me)

export default Authroute
