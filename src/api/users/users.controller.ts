import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { Serialize } from "../interceptors/serialize.interceptor";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

interface Session {
	userId?: number | null;
	[key: string]: any;
}

@Controller("/auth")
@Serialize(UserDto)
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
	) {}

	@Post("/signup")
	async createUser(@Body() body: CreateUserDto, @Session() session: Session) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;

		return user;
	}

	@Get("/whoami")
	@UseGuards(AuthGuard)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@Post("/signout")
	signOut(@Session() session: Session) {
		session.userId = null;
	}

	@Post("/signin")
	async signin(@Body() body: CreateUserDto, @Session() session: Session) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;

		return user;
	}

	@Get("/:id")
	async findUser(@Param("id") id: string) {
		const user = await this.usersService.findOne(Number.parseInt(id));

		if (!user) throw new NotFoundException("User not found");

		return user;
	}

	@Get()
	findAllUsers(@Query("email") email: string) {
		return this.usersService.find(email);
	}

	@Delete("/:id")
	removeUser(@Param("id") id: string) {
		return this.usersService.remove(Number.parseInt(id));
	}

	@Patch("/:id")
	updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(Number.parseInt(id), body);
	}
}
