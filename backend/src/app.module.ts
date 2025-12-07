import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BorrowersModule } from './modules/borrowers/borrowers.module';
import { BooksModule } from './modules/books/books.module';
import { LoansModule } from './modules/loans/loans.module';
import { LocationsModule } from './modules/locations/locations.module';
import { UploadModule } from './modules/upload/upload.module';
import { SearchModule } from './modules/search/search.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'kashidashi',
      password: process.env.DB_PASSWORD || 'kashidashi',
      database: process.env.DB_DATABASE || 'kashidashi',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    BorrowersModule,
    BooksModule,
    LoansModule,
    LocationsModule,
    UploadModule,
    SearchModule,
    InventoryModule,
    DatabaseModule,
  ],
})
export class AppModule {}
