import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({ description: 'User first name', example: 'John', minLength: 2 })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe', minLength: 2 })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
