import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("Authentication System (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("handles a signup request", () => {
		const email = "test-1@test.com";

		return request(app.getHttpServer())
			.post("/auth/signup")
			.send({ email, password: "12345" })
			.expect(201)
			.then((res) => {
				const { id, email } = res.body;
				expect(id).toBeDefined();
				expect(email).toEqual(email);
			});
	});

	it("signup as new user and then get the currently logged in user", async () => {
		const email = "test-1@test.com";

		const res = await request(app.getHttpServer())
			.post("/auth/signup")
			.send({ email, password: "12345" })
			.expect(201);

		const cookie = res.get("Set-Cookie");
		if (!cookie) throw new Error("Cookie header not set");

		const { body } = await request(app.getHttpServer())
			.get("/auth/whoami")
			.set("Cookie", cookie)
			.expect(200);

		expect(body.email).toEqual(email);
	});
});
