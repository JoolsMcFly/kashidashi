import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('borrowers')
@UseGuards(JwtAuthGuard)
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.borrowersService.search(query);
  }

  @Get()
  findAll() {
    return this.borrowersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowersService.findOne(id);
  }
}
