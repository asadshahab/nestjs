import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //middleware
  app.use(morgan('dev'));
  const options = new DocumentBuilder()
    .setTitle('NestJS Store Application')
    .setDescription('The NestJS Store Application in which we will be using GraphQL and TypeORM')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      }, 'JWT-auth'
    ).build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); 



  await app.listen(3000);
}
bootstrap();
