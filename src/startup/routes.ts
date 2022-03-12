import express from "express";
import cors from "cors";
import arrRouter, {
  dbEntryRoutePath,
} from "../middleware/routes/dbEntryRoutes";
import userRouter from "../middleware/routes/userRoutes";
import { authTokenKey } from "../client/src/App/sharedWithServer/User/crudTypes";
import { config } from "../client/src/App/Constants";

export default function routes(app: express.Application) {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
      ],
      credentials: true,
      exposedHeaders: [authTokenKey],
    })
  );
  app.use(express.json()); // parses body into a JSON object
  app.use(config.url.bit.dbEntry, arrRouter);
  app.use(config.url.bit.user, userRouter);
}
