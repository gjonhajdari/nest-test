import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsModule } from "./api/reports/reports.module";
import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
const cookieSession = require("cookie-session");
const dbConfig = require("../ormconfig.js");

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRoot(dbConfig),

		// TypeOrmModule.forRootAsync({
		// 	inject: [ConfigService],
		// 	useFactory: (config: ConfigService) => {
		// 		return {
		// 			type: "sqlite",
		// 			database: config.get<string>("DB_NAME"),
		// 			entities: [User, Report],
		// 			synchronize: true,
		// 		};
		// 	},
		// }),

		// TypeOrmModule.forRoot({
		// 	type: "sqlite",
		// 	database: "db.sqlite",
		// 	entities: [User, Report],
		// 	synchronize: true,
		// }),
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
	constructor(private configService: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					keys: [this.configService.get("COOKIE_KEY")],
				}),
			)
			.forRoutes("*");
	}
}
