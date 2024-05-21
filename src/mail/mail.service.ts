import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './models/dto/send-email.dto';

@Injectable()
export class MailService {
  async sendEmail(sendEmailDto: SendEmailDto): Promise<string> {
    try {
      // Create a SMTP transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'nghianmgcc200100@fpt.edu.vn',
          pass: 'yvsj cliz iedz ggov',
        },
      });

      // Define email options
      const mailOptions = {
        from: 'nghianmgcc200100@fpt.edu.vn',
        to: sendEmailDto.recipientEmail,
        subject: sendEmailDto.subject,
        text: sendEmailDto.message,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log('email sent');
      return 'Email sent successfully.';
    } catch (error) {
      console.error('Error sending email:', error);
      console.log('email cannot sent');
      throw new Error('Failed to send email.');
    }
  }
}
