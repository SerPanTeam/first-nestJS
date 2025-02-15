# Структура проекта

```plaintext
├── src
│   ├── tag
│   │   ├── tag.controller.ts
│   │   ├── tag.entity.ts
│   │   ├── tag.module.ts
│   │   └── tag.service.ts
│   ├── user
│   │   ├── dto
│   │   │   └── createUser.dto.ts
│   │   ├── user.controller.ts
│   │   ├── user.entity.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── codewr.js
├── combined-files.md
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── requests.http
├── tsconfig.build.json
└── tsconfig.json

```

# Файлы .ts, .tsx, .css

## src\app.controller.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

```

## src\app.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

## src\app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TagModule,
    // TypeOrmModule.forRoot(config),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 🟢 Доступ к .env
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'mypassword'),
        database: configService.get<string>('DB_NAME', 'mydb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

## src\app.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

## src\main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Включаем CORS (если нужно, можно настроить origin)
  app.enableCors();

  // Префикс для всех роутов (например, будет /api/users, /api/tags)
  app.setGlobalPrefix('api');

  // 1) Настраиваем конфигурацию Swagger
  const config = new DocumentBuilder()
    .setTitle('My App')
    .setDescription('API documentation')
    .setVersion('1.0')
    // .addBearerAuth() // если нужно авторизовываться через Bearer Token
    .build();

  // 2) Создаём документ
  const document = SwaggerModule.createDocument(app, config);

  // 3) Подключаем UI на эндпоинте /api/docs
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3333; // 🟢 Берём порт из .env
  await app.listen(port);
}
void bootstrap();

```

## src\tag\tag.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}

```

## src\tag\tag.entity.ts

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

```

## src\tag\tag.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [TypeOrmModule.forFeature([TagEntity])],
})
export class TagModule {}

```

## src\tag\tag.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}

```

## src\user\dto\createUser.dto.ts

```typescript
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

```

## src\user\user.controller.ts

```typescript
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

```

## src\user\user.entity.ts

```typescript
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column({ default: '' })
  role: string;
  @Column({ default: '' })
  bio: string;
  @Column({ default: '' })
  image: string;
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}

```

## src\user\user.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}

```

## src\user\user.service.ts

```typescript
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

```

## test\app.e2e-spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});

```

# Дополнительные файлы

⚠️ Файл **index.html** не найден и пропущен.

