import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth.guard';
import { Public } from '../decorators/public.decorator';
import { Admin } from 'typeorm';
import { AdminResponse } from '../admin.response';
import { Role } from '../role.enum';
import { Roles } from '../decorators/roles.decoratos';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  async adminOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for admins only' });
  }
}
