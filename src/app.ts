import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import apiRoutes from "./routes"; 
import { registerHealthRoutes } from "./routes/health.route";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = (): Application => {
  const app = express();

  // ---------- Middlewares ----------
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // ---------- Routes ----------
  registerHealthRoutes(app);          
  app.use("/api", apiRoutes);        

  // ---------- Error Handler ----------
  app.use(errorHandler);

  return app;
};
