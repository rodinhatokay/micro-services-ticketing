import { Publisher, OrderCreatedEvent, Subjects } from "@rohtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
