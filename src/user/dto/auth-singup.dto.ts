import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User, UserRole } from '../user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class AuthSignupDto {
  @Field()
  @ApiProperty({ type: String })
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  @ApiProperty({ type: String })
  email: string;

  @IsString()
  @Field()
  @ApiProperty({ type: String })
  phoneNum?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Field()
  @ApiProperty({ type: String })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @Field()
  @ApiProperty({ type: String })
  password: string;
}

@ObjectType()
export class accessTokenPayloadDTO {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
