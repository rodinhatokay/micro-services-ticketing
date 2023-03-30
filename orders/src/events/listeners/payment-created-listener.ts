import {
	Listener,
	OrderStatus,
	PaymentCreatedEvent,
	Subjects,
} from "@rohtickets/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId);
		if (!order) {
			throw new Error("Order not found");
		}
		order.set({
			status: OrderStatus.Complete,
		});
		await order.save();

		// in ideal world we need to publish again the order that updated or completed
		// since each time we are saving the order it increases the version

		msg.ack();
	}
}
