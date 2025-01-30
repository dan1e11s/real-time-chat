import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неправильный пароль');
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    const { password, ...userData } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async register(username: string, password: string) {
    const hashedPass = await bcrypt.hash(password, 10);
    return this.userService.createUser(username, hashedPass);
  }
}
