import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// import app from "../app";
// import request from "supertest";
import jwt from "jsonwebtoken";

process.env.STRIPE_KEY =
	"sk_test_51MqwWuIBFlCoH2dfDSA8kF8WBxIoB2rZaQBGWvjRJXUTF7Ed1ZJHorxskU61zfzPz6Iosxrc5TUGN4qavc7D78ia007CaU8K7E";

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = "asdf";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

jest.mock("../nats-wrapper");

beforeEach(async () => {
	// Clean up database before each test
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

declare global {
	var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
	// Build a JWT payload. { id, email }
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};
	// create a JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	// Build session Object. { jwt: MY_JWT }
	const session = { jwt: token };
	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);
	// Take JSON and encoide it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");
	// return a string thats the cookie with encoded data
	return [`session=${base64}`];
};
