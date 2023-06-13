import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import e from 'express';

@Module({
  providers: [ PaginationService],
  exports: [ PaginationService]
})
export class PaginationModule {}
