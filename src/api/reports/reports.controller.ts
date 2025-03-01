import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../guards/admin.guard";
import { AuthGuard } from "../guards/auth.guard";
import { Serialize } from "../interceptors/serialize.interceptor";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { User } from "../users/user.entity";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { CreateReportDto } from "./dtos/create-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";
import { ReportDto } from "./dtos/report.dto";
import { ReportsService } from "./reports.service";

@Controller("/reports")
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@Get()
	getEstimate(@Query() query: GetEstimateDto) {
		return this.reportsService.createEstimate(query);
	}

	@Get("/all")
	getReports() {
		return this.reportsService.getReports();
	}

	@Post()
	@UseGuards(AuthGuard)
	@Serialize(ReportDto)
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportsService.createReport(body, user);
	}

	@Patch("/:id")
	@UseGuards(AdminGuard)
	approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
		return this.reportsService.changeApproval(
			Number.parseInt(id),
			body.approved,
		);
	}
}
