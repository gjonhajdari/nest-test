import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { CreateReportDto } from "./dtos/create-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";
import { Report } from "./report.entity";

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

	createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
		return this.repo
			.createQueryBuilder()
			.select("AVG(price)", "price")
			.where("make = :make", { make })
			.andWhere("model = :model", { model })
			.andWhere("ABS(lat - :lat) <= 5", { lat })
			.andWhere("ABS(lng - :lng) <= 5", { lng })
			.andWhere("year - :year BETWEEN -3 AND 3", { year })
			.andWhere("approved IS TRUE")
			.groupBy("mileage")
			.orderBy("ABS(mileage - :mileage)", "ASC")
			.setParameters({ mileage })
			.limit(3)
			.getRawOne();
	}

	getReports() {
		return this.repo.find();
	}

	createReport(reportDto: CreateReportDto, user: User) {
		const report = this.repo.create(reportDto);
		report.user = user;

		return this.repo.save(report);
	}

	async changeApproval(id: number, approved: boolean) {
		const report = await this.repo.findOne({ where: { id } });
		if (!report) throw new NotFoundException("Report not found");

		report.approved = approved;
		return this.repo.save(report);
	}
}
