// import mongoose from "mongoose"
// import bcrypt from "bcrypt"

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// )

// // hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return

//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

// // compare a plain-text password against the stored hash (used during login)
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password)
// }

// // never send the password hash back in API responses
// userSchema.methods.toJSON = function () {
//   const user = this.toObject()
//   delete user.password
//   return user
// }

// const User = mongoose.model("User", userSchema)

// export default User



















import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

// hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// compare a plain-text password against the stored hash (used during login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// never send the password hash back in API responses
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model("User", userSchema)

export default User