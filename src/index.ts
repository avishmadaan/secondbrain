import express from "express";
import { userRouter } from "./routes/userRouter";
import { contentRouter } from "./routes/contentRouter";
import { shareRouter } from "./routes/shareRouter";
import mongoose   from "mongoose";
import { MONGO_URI, PORT } from "./config";


const app = express();
app.use(express.json());


app.use("/api/v1/user", userRouter );
app.use("/api/v1/content", contentRouter );
app.use("/api/v1/brain", shareRouter );




async function main() {
    await mongoose.connect(MONGO_URI as string);
    app.listen(PORT);
    console.log(`Listening on Port ${PORT}`)
}
main();
