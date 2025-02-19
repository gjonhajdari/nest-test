import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;

	beforeEach(async () => {
		// Create fake copy of the users service
		const users: User[] = [];

		fakeUsersService = {
			find: (email: string) => {
				const filteredUsers = users.filter((user) => user.email === email);
				return Promise.resolve(filteredUsers);
			},
			create: (email: string, password: string) => {
				const user = {
					id: Math.floor(Math.random() * 999999999),
					email,
					password,
				} as User;

				users.push(user);
				return Promise.resolve(user);
			},
		};

		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: fakeUsersService,
				},
			],
		}).compile();

		service = module.get(AuthService);
	});

	it("Can create an instance of auth service", async () => {
		expect(service).toBeDefined();
	});

	it("Can create a new user with a salted and hashed password", async () => {
		const user = await service.signup("asd@asd.com", "12345");

		expect(user.password).not.toEqual("12345");
		const [salt, hash] = user.password.split(".");
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it("Throws an error if user signs up with an email that's already in use", async () => {
		await service.signup("asd@asd.com", "12345");

		await expect(service.signup("asd@asd.com", "12345")).rejects.toThrow(
			BadRequestException,
		);
	});

	it("Throws if email doesn't exist when signing in", async () => {
		await expect(service.signin("asd@asd.com", "12345")).rejects.toThrow(
			NotFoundException,
		);
	});

	it("Throws if a wrong password is provided", async () => {
		await service.signup("asd@asd.com", "12345678");
		await expect(service.signin("asd@asd.com", "123")).rejects.toThrow(
			BadRequestException,
		);
	});

	it("Returns a user if correct password is provided", async () => {
		await service.signup("asd@asd.com", "12345678");
		const user = await service.signin("asd@asd.com", "12345678");

		expect(user).toBeDefined();
	});
});
