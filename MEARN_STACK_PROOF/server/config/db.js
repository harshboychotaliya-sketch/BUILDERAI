import mongoose from "mongoose";


export async function conntectTodatabase() {
    mongoose.connection.on('connected', ()=> {
        console.log("MongoDB connected sucessFully");
    })
    await mongoose.connect(process.env.MONGODB_URI)
}

