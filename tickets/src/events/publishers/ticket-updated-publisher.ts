import { Publisher, Subjects, TicketUpdatedEvent } from "@rohtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TickerUpdated;
}
