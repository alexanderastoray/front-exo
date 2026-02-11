import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User first name', example: 'John', minLength: 2 })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe', minLength: 2 })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'User email address', example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
