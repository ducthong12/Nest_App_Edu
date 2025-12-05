import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  app.use(helmet());
  await app.listen(process.env.ANALYTICS_SERVICE_PORT ?? 3002);
}
bootstrap();
