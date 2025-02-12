import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAll() {
    return await this.userRepository.find();
  }
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }
  generateJwt(user: Promise<UserEntity>): string {
    return 'xxxxxx';
  }
  buildUserResponse(user: Promise<UserEntity>): any {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
