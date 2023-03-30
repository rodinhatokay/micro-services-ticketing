import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@rohtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: "vdbxcvb",
		expiresAt: "asdas",
		ticket: {
			id: "cvbxvc",
			price: 10,
		},
	};
	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, data, message };
};

it("replicates the order info", async () => {
	const { data, listener, message } = await setup();
	await listener.onMessage(data, message);

	const order = await Order.findById(data.id);
	expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
	const { data, listener, message } = await setup();
	await listener.onMessage(data, message);
	expect(message.ack).toHaveBeenCalled();
});
