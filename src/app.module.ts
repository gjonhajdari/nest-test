import { Module } from "@nestjs/common";
import { ReportsModule } from "./api/reports/reports.module";
import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [UsersModule, ReportsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
