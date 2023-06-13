import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import PaginationPayloadInterface from './dto/pagination-payload-interface.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    page: number,
    limit: number,
  ): Promise<PaginationPayloadInterface<T>> {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await repository.findAndCount({
      skip,
      take: limit,
    });
    const totalPages = Math.ceil(totalCount / limit);
    return {
      totalCount,
      page,
      limit,
      totalPages,
      data,
    };
  }
}
