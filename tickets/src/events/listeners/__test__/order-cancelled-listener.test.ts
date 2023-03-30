import mongoose from "mongoose";
import { OrderCancelledEvent } from "@rohtickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		price: 15,
		title: "concert",
		userId: "asdzxc",
	});

	ticket.set({ orderId });
	await ticket.save();

	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, message, data, ticket };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
	const { data, listener, message, ticket } = await setup();
	await listener.onMessage(data, message);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(message.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
