import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;

	beforeEach(async () => {
		// Create fake copy of the users service
		fakeUsersService = {
			find: () => Promise.resolve([]),
			create: (email: string, password: string) =>
				Promise.resolve({ id: 1, email, password } as User),
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
		fakeUsersService.find = () =>
			Promise.resolve([
				{ id: 1, email: "asd@asd.com", password: "12345" } as User,
			]);

		await expect(service.signup("asd@asd.com", "12345")).rejects.toThrow(
			BadRequestException,
		);
	});
});
