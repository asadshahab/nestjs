import * as bcrypt from 'bcrypt';

export class HashPassword {
  public static async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  public static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
// Compare this snippet from src/auth/auth.service.ts
