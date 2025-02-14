import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('users') // Группа в Swagger
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  showAllUsers() {
    return this.userService.findAll();
  }
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity> {
    console.log(createUserDto);
    const user  = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}
