import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'alice',
    description: 'User name',
  })
  @IsString()
  @Length(3, 60)
  name: string;

  @ApiProperty({
    example: 'alice@alice.alice',
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
