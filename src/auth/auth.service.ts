import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(singupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(singupInput);

    const token = this.jwtService.sign({ id: user.id });

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('email y/o contraseña no correcta');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.jwtService.sign({ id: user.id });
    return { token, user };
  }
}
