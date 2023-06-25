import express from "express";
import analyticsRoute from "./routes/analytics.js"
import homeRoute from "./routes/home.js"
import authRoute from "./routes/auth.js"
import cookieParser from "cookie-parser";
import userRoute from "./routes/users.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/analytics", analyticsRoute);
app.use("/", homeRoute);
app.use("/auth", authRoute);
app.use("/profile", userRoute);

app.listen(8800, () => {
    console.log("Server running on port 8800");
})