const express = require('express');
const app = express();
const fs = require('fs').promises;
const accountsRouter = require('./routes/accounts.js');
const winston = require('winston');

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
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
      if (err) {
        logger.error(err);
      }
    });
  }
});

// Fica rodando esperando noas requisições
