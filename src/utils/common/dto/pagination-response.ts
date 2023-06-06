import { Pagination } from 'nestjs-typeorm-paginate';
import { ResponsePayload } from '../dto/index.dto';

export class PaginationResponse extends ResponsePayload {
  data: Pagination<any>;
}
