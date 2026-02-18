import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class GuestbookService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async create(dto: CreatePostDto) {
    const { data, error } = await this.supabaseService.supabase
      .from('guestbook')
      .insert([{ name: dto.name, message: dto.message }])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabaseService.supabase
      .from('guestbook')
      .delete()
      .eq('id', id);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { success: true };
  }
}
