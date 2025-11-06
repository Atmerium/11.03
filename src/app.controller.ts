import { Controller, Get, Render, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getInfo(){
    return{
      errors: [],
      values: {
        name: '',
        email: '',
        datetime: '',
        guests: '1',
      },
    };
  }

  @Post('booking')
  async submitBooking(@Body() body: any, @Res() res: Response){
    const errors: string[] = [];
    const values = {
      name: (body.name || '').trim(),
      email: (body.email || '').trim(),
      datetime: (body.datetime || '').trim(),
      guests: body.guests || '',
    };

    if (!values.name) {
      errors.push('A név megadása kötelező.');
    }

    const emailRe = /^[^@]+@[^@]+$/;
    if (!values.email) {
      errors.push('Az e-mail cím megadása kötelező.');
    } else if (!emailRe.test(values.email)) {
      errors.push('Az e-mail cím formátuma érvénytelen (pl. abc@def.hu).');
    }

    if (!values.datetime) {
      errors.push('A dátum és időpont megadása kötelező.');
    } else {
      const submitted = new Date(values.datetime);
      const now = new Date();
      if (isNaN(submitted.getTime())) {
        errors.push('Érvénytelen dátum/idő formátum.');
      } else if (submitted < now) {
        errors.push('A kiválasztott dátum/idő nem lehet korábbi a jelenleginél.');
      } else {
        values.datetime = submitted.toISOString();
      }
    }

    const guestsNum = parseInt(values.guests, 10);
    if (!values.guests) {
      errors.push('A vendégek számának megadása kötelező.');
    } else if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 10) {
      errors.push('A vendégek száma 1 és 10 között lehet.');
    }

    if (errors.length > 0) {
      let datetimeLocal = body.datetime || '';
      try {
        const d = new Date(values.datetime);
        if (!d) {
          datetimeLocal = d
        }
      } catch {
        datetimeLocal = body.datetime || '';
      }

      return res.render('index', {
        errors,
        values: {
          name: values.name,
          email: values.email,
          datetime: datetimeLocal,
          guests: values.guests,
        },
      });
    }

    this.appService.saveBooking({
      name: values.name,
      email: values.email,
      datetime: values.datetime,
      guests: guestsNum,
    });

    return res.redirect('/success');
  }

  @Get('success')
  @Render('success')
  successPage() {
    return {};
  }
}
