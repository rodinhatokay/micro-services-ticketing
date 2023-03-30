import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@rohtickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
	// Create an instance of a listener
	const listener = new OrderCreatedListener(natsWrapper.client);
	// Create and save a ticket

	const ticket = Ticket.build({
		title: "concert",
		price: 99,
		userId: "asdadcz",
	});

	await ticket.save();

	// Create the fake data event
	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: "fake-value",
		expiresAt: "fake-value",
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};
	// Create the fake message object
	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, data, message, ticket };
};

it("sets the orderId of the ticket", async () => {
	const { data, listener, message, ticket } = await setup();
	await listener.onMessage(data, message);
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the messag", async () => {
	const { data, listener, message } = await setup();
	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});

it("publishes a tciker updated event", async () => {
	const { listener, ticket, data, message } = await setup();
	await listener.onMessage(data, message);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(data.id).toEqual(ticketUpdatedData.orderId);
});
