import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@rohtickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
	// Create a listener
	const listener = new TicketUpdatedListener(natsWrapper.client);
	// Create and save a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();
	// Creat a fake data object
	const data: TicketUpdatedEvent["data"] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: "new concert",
		price: 555,
		userId: "czxadsqwe",
	};
	// Create a fake message object
	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	// return all of this stuff
	return { listener, data, message, ticket };
};

it("finds, updates and saves a ticket", async () => {
	const { message, data, listener, ticket } = await setup();
	await listener.onMessage(data, message);
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
	const { message, data, listener } = await setup();

	// call the onMessage functino with the data object + message object
	await listener.onMessage(data, message);

	// Make sure ack function is called
	expect(message.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
	const { listener, data, message } = await setup();
	data.version = 10;
	try {
		await listener.onMessage(data, message);
	} catch (err) {}
	expect(message.ack).not.toHaveBeenCalled();
});
