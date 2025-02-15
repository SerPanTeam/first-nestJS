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
  generateJwt(user: UserEntity): string {
    return 'xxxxxx';
  }
  buildUserResponse(user: UserEntity): any {
    const { password, ...restFieldsUser } = user;
    return {
      user: {
        ...restFieldsUser,
        token: this.generateJwt(user),
      },
    };
  }
}
