import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { TaskStatus } from './task.model';
import { Transform } from 'class-transformer/types/decorators/transform.decorator';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(3)
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;

    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length > 0);
  })
  labels?: string[];

  @IsOptional()
  @IsIn(['title', 'status', 'createdAt', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
