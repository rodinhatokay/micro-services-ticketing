import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from "@rohtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
