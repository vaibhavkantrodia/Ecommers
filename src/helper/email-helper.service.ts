import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { ErrorHandlerService } from 'src/utils/error-handler.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) { }

  async sendEmail(
    toEmail: string,
    subject: string,
    html: string,
  ): Promise<any> {
    try {
      const ses = new SES({
        region: this.configService.get('AWS_REGION'),
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        apiVersion: '2010-12-01',
      });

      const params = {
        Destination: {
          ToAddresses: [toEmail],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        Source: this.configService.get('AWS_SES_EMAIL'),
      };
      return await ses.sendEmail(params).promise();
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
