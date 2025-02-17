import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import config from "./config/config";
import jwtStrategy from "./config/passport";
import router from "./routes/v1";
const app = express();

app.use(express.json());

app.use(cors());
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Health Check Complete");
});

mongoose
  .connect(config.mongoose.url)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  });
