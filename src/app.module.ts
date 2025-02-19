import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "./api/reports/report.entity";
import { ReportsModule } from "./api/reports/reports.module";
import { User } from "./api/users/user.entity";
import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
const cookieSession = require("cookie-session");

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "sqlite",
			database: "db.sqlite",
			entities: [User, Report],
			synchronize: true,
		}),
		UsersModule,
		ReportsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					keys: ["asdfasdf"],
				}),
			)
			.forRoutes("*");
	}
}
