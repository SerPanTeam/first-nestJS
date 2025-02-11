import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  showAllUsers() {
    // return ['User 1', '2 User'];
    return this.userService.findAll();
  }
}
