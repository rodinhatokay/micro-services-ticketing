import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@rohtickets/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/orders";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.Created,
		userId: "xczvxc",
		expiresAt: new Date(),
		ticket,
	});

	await order.save();

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, ticket, order, data, message };
};

it("updated the order status to cancelled", async () => {
	const { data, listener, message, order, ticket } = await setup();

	await listener.onMessage(data, message);
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
	const { data, listener, message, order, ticket } = await setup();

	await listener.onMessage(data, message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
	const { data, listener, message, order, ticket } = await setup();

	await listener.onMessage(data, message);
	expect(message.ack).toHaveBeenCalled();
});
