import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  podcastId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
