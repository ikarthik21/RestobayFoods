import ENV_VARIABLES from "./config/environment.js";
import express from "express";
import errorHandler from "./middleware/error.js";
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import router from "./routes/rotues.js";
import { testConnection } from "./config/database.js";
const app = express();

app.use(express.json());
app.use(errorHandler);
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use("/api", router);

testConnection();

app.listen(ENV_VARIABLES.PORT, () => {
  console.log(`📶 Server is running on http://localhost:${ENV_VARIABLES.PORT}`);
});
