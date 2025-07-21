import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { sendPasswordConfirmation } from 'src/utils/emailTemplates/sendPasswordConfirmation';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: config.get('SMTP_PORT'),
      auth: {
        user: config.get('SMTP_EMAIL'),
        pass: config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendConfirmation(token: string, email: string) {
    const serverUrl = this.config.get('SERVER_URL') as string;
    const link = `${serverUrl}/auth/confirm-email/${token}`;

    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: email,
      subject: 'Please confirm your email address',
      html: sendPasswordConfirmation(link),
    });
  }

  async youMissedUsSoMuch(email: string) {
    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: email,
      subject: 'Connectez vous au plus vite',
      html: `<div> Connectez ou nous vous afin de revalider nos conditions d utilisation mettrons en prison</div>`,
    });
  }
}
