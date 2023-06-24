import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
