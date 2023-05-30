import { UserRole } from './user-role.enum';

export class JwtPayload {
  username: string;
  role: string;
}
