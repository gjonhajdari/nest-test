import { IsEmail, IsOptional, IsString, isString } from "class-validator";

export class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	password: string;
}
