import { Injectable } from '@nestjs/common';
const puppeteer = require('puppeteer');
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  pdfHandler(request: Request, response: Response) {
    console.log('request', request.query);
    const { keywords } = request.query;
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--ignore-certificate-errors',
          '--disable-web-security',
        ],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      const pdfConfig = {
        format: 'A4',
        headerTemplate: '',
        footerTemplate: '',
        margin: {
          top: 100,
          bottom: 80,
        },
        displayHeaderFooter: true,
      };
      try {
        await page.goto(`https://www.baidu.com/s?wd=${keywords}`, {
          waitUntil: 'networkidle2',
        });
        const pdfBuffer = await page.pdf({
          ...pdfConfig,
        });
        response.set({
          'Content-Type': 'application/pdf',
        });
        response.send(pdfBuffer);
        await browser.close();
      } catch (error) {
        response.status(500);
      }
    })();
  }
}
