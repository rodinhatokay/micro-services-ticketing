import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
	statusCode = 400;
	constructor(public errors: ValidationError[]) {
		super("Invalid request paramaters");

		// Only because we are extending a build in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((_error) => {
			return { message: _error.msg, field: _error.param };
		});
	}
}
