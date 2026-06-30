import { Module } from "@nestjs/common";
import { ClienteController } from "../adapters/controllers/ClienteController";

@Module({
  controllers: [ClienteController],
  providers: [],
})
export class AppModule {}