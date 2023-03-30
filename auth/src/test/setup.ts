import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = "asdf";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	// Clean up database before each test
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
	var signin: () => Promise<string[]>;
}

global.signin = async () => {
	const email = "test@test.com";
	const password = "password";
	const response = await request(app)
		.post("/api/users/signup")
		.send({ email, password })
		.expect(201);
	console.log("response", response.body);
	const cookie = response.get("Set-Cookie");
	return cookie;
};
