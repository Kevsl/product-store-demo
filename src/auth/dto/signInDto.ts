import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'oM5GZ@example.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'APassword123456!',
    description: 'A strong password',
  })
  @IsStrongPassword()
  password: string;
}
