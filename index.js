import express from 'express';
import { promises } from 'fs';
import winston from 'winston';
import accountsRouter from './routes/accounts.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './doc.js';
import cors from 'cors';

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

global.fileName = 'accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    // prettier-ignore
    new (winston.transports.Console)(),
    // prettier-ignore
    new (winston.transports.File)({ filename: 'my-bank-api-logger' }),
  ],

  format: combine(
    // prettier-ignore
    label({ label: 'my-bank-api'}),
    timestamp(),
    myFormat
  ),
});

app.use(express.json());
app.use(cors());
app.use('/account', accountsRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, async () => {
  try {
    await readFile(global.fileName, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    await writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
      if (err) {
        logger.error(err);
      }
    });
  }
});
