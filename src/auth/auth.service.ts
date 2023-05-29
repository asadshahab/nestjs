import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthSignupDto } from './dto/auth-singup.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class AuthService {
  // inject the repository from entity
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) // private productServices: ProductsService,
  {}

  // Get all users
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //   sing-up user
  async signupUser(authSignupDto: AuthSignupDto): Promise<User> {
    return await this.userRepository.save(authSignupDto);
  }
}
