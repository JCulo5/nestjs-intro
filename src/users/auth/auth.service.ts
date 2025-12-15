import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { create } from 'domain';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  //user registration
  //- make sure user does not exist yet
  //- store the user
  //-(optional) genereate the token
  //genereate token
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.createUser(createUserDto);

    return user;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await this.passwordService.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, name: user.name };
    return this.jwtService.sign(payload);
  }
}
