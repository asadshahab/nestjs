import { Pagination } from 'nestjs-typeorm-paginate';
import { ResponsePayload } from '../dto/index.dto';

export class PaginationResponse<T> extends ResponsePayload {
  data: Pagination<T>;
}
