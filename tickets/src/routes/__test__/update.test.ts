import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/ticket/${id}`)
		.set("Cookie", global.signin())
		.send({ title: "asd", price: 20 })
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: "asd", price: 20 })
		.expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "asldkfj",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "alskdjflskjdf",
			price: 1000,
		})
		.expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdzxczx",
			price: 20,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "asdas",
			price: -10,
		})
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdzxczx",
			price: 20,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

	const ticketResp = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResp.body.title).toEqual("new title");
	expect(ticketResp.body.price).toEqual(100);
});

it("publishes an event", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdzxczx",
			price: 20,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdzxczx",
			price: 20,
		})
		.expect(201);

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(400);
});
