import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsModule } from "./api/reports/reports.module";
import { User } from "./api/users/user.entity";
import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "sqlite",
			database: "db.sqlite",
			entities: [User],
			synchronize: true,
		}),
		UsersModule,
		ReportsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
