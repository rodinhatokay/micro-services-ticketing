import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@rohtickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();

app.use(json());

app.set("trust proxy", true);
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);
export default app;
