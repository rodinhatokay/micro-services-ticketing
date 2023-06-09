import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@rohtickets/common";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

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

app.use(createOrderRouter); // create order
app.use(showOrderRouter); // get single order by id
app.use(indexOrderRouter); // get all orders
app.use(deleteOrderRouter); // delete order

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);
export default app;
