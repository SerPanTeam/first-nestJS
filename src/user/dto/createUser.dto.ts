import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @Length(6, 50)
  readonly password: string;
}
