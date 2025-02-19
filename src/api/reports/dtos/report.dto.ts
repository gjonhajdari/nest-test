import { Expose, Transform } from "class-transformer";
import { Report } from "../report.entity";

export class ReportDto {
	@Expose()
	id: number;

	@Expose()
	make: string;

	@Expose()
	model: string;

	@Expose()
	year: number;

	@Expose()
	mileage: number;

	@Expose()
	lat: number;

	@Expose()
	lng: number;

	@Expose()
	price: number;

	@Expose()
	approved: number;

	@Transform(({ obj }: { obj: Report }) => obj.user.id)
	@Expose()
	userId: number;
}
