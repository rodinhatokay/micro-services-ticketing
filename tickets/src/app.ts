import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@rohtickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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

app.use(createTicketRouter); // create ticket
app.use(showTicketRouter); // get single ticket by id
app.use(indexTicketRouter); // get all tickets
app.use(updateTicketRouter); // update ticket

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);
export default app;
