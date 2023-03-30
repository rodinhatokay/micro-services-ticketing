import { Subjects, Publisher, PaymentCreatedEvent } from "@rohtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
