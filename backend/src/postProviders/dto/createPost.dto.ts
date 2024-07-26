import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContentDto {
    @IsOptional()
    @IsString()
    facebook?: string;

    @IsOptional()
    @IsString()
    twitter?: string;

    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    instagram?: string;
}

export class CreatePostDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ContentDto)
    content: ContentDto;

    @IsOptional()
    @IsString()
    image?: string;
}
