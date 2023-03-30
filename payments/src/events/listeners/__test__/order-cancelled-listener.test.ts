import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { OrderStatus, OrderCancelledEvent } from "@rohtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 50,
		status: OrderStatus.Created,
		version: 0,
		userId: "cvbdfgdf",
	});
	await order.save();
	const data: OrderCancelledEvent["data"] = {
		id: order.id,
		version: 1,
		ticket: {
			id: "gfgfhg",
		},
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, data, message, order };
};

it("updated the status of the order", async () => {
	const { listener, data, message, order } = await setup();

	await listener.onMessage(data, message);
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
	const { listener, data, message, order } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});
