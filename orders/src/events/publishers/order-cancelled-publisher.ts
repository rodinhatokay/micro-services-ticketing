import { Publisher, Subjects, OrderCancelledEvent } from "@rohtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
