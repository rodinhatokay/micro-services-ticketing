import mongoose from "mongoose";
import { TicketCreatedEvent } from "@rohtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listener
	const listener = new TicketCreatedListener(natsWrapper.client);
	// Create a fake data event
	const data: TicketCreatedEvent["data"] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		title: "concert",
		userId: new mongoose.Types.ObjectId().toHexString(),
	};
	// Create a fake message object
	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};
	return { listener, data, message };
};

it("creates and saves a ticket", async () => {
	const { data, listener, message } = await setup();
	// Call the onMessage function with the data object + message object
	await listener.onMessage(data, message);
	// Write assertions to make sure a ticket was created!
	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
	const { data, listener, message } = await setup();

	// call the onMessage functino with the data object + message object
	await listener.onMessage(data, message);

	// Make sure ack function is called
	expect(message.ack).toHaveBeenCalled();
});
