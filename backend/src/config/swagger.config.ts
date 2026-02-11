import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Expense Management API')
    .setDescription('API for managing expense reports, expenses, and attachments')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('expense-reports', 'Expense report management endpoints')
    .addTag('expenses', 'Expense management endpoints')
    .addTag('attachments', 'Attachment management endpoints')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (V2 - not implemented in V1)',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
