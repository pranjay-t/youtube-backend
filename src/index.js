import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
    path: './env'
})

connectDB().then(
    () => {
        app.on("error", (err)=>{
        console.log("Error", err);
        throw err;
    }),

    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at ${process.env.PORT}`);

    })
    }
).catch(
    (err)=>{
        console.log("MongoDB connection faileld",err);
    }
);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});