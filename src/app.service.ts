import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  saveBooking(booking: any) {
    const filePath = 'bookings.csv';
    const header = 'name,email,datetime,guests\n';
    const line = `${booking.name},${booking.email},${booking.datetime},${booking.guests}\n`;

    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, header, 'utf8');
      }
      
      fs.appendFileSync(filePath, line, 'utf8');

    } catch (err) {
      console.error('Hiba történt a mentéskor:', err);
    }
  }

}
