import { Publisher, Subjects, TicketCreatedEvent } from "@rohtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
