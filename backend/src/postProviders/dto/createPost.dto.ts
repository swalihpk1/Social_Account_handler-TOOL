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

class LibraryImageDto {
    @IsNotEmpty()
    @IsString()
    src: string;

}

export class CreatePostDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ContentDto)
    content: ContentDto;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => LibraryImageDto)
    libraryImage?: LibraryImageDto;
}
