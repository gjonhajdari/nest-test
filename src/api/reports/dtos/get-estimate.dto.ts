import { Transform } from "class-transformer";
import {
	IsLatitude,
	IsLongitude,
	IsNumber,
	IsString,
	Max,
	Min,
} from "class-validator";

export class GetEstimateDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@Transform(({ value }) => Number.parseInt(value))
	@IsNumber()
	@Min(1930)
	@Max(2050)
	year: number;

	@Transform(({ value }) => Number.parseInt(value))
	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;

	@Transform(({ value }) => Number.parseFloat(value))
	@IsLatitude()
	lat: number;

	@Transform(({ value }) => Number.parseFloat(value))
	@IsLongitude()
	lng: number;
}
