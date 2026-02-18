import {
  Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { GuestbookService } from './guestbook.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Get()
  findAll() {
    return this.guestbookService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePostDto) {
    return this.guestbookService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.guestbookService.remove(id);
  }
}
