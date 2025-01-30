import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    const users = await this.userService.searchUsers(query);
    return users;
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
