import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
  let account = req.body;

  try {
    const data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account ${err.message}`);
  }
});

router.get('/', async (_, res) => {
  try {
    const data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    delete json.nextId;
    res.send(json);
    logger.info('GET /account');
  } catch {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account ${err.message}`);
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await readFile(global.fileName, 'utf8');
    const json = JSON.parse(data);
    const account = json.accounts.find((account) => account.id === id);

    account ? res.send(account) : res.end();
    logger.info(`GET /account:id - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account:id ${err.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const accounts = json.accounts.filter((account) => account.id !== id);
    json.accounts = accounts;

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
    logger.info(`DELETE /account:id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /account:id ${err.message}`);
  }
});

router.put('/', async (req, res) => {
  const newAccount = req.body;
  let data = await readFile(global.fileName, 'utf8');

  let json = JSON.parse(data);
  // prettier-ignore
  const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id);

  const { name, balance } = newAccount;

  json.accounts[oldIndex].name = name;
  json.accounts[oldIndex].balance = balance;

  await writeFile(global.fileName, JSON.stringify(json));
  res.end();
  logger.info(`PUT /account - ${JSON.stringify(newAccount)}`);

  try {
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /account ${err.message}`);
  }
});

router.post('/transaction', async (req, res) => {
  const params = req.body;

  try {
    const data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    // prettier-ignore
    const index = json.accounts.findIndex(account => account.id === params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error('Não há saldo suficiente para saque');
    }

    json.accounts[index].balance += params.value;

    await writeFile(global.fileName, JSON.stringify(json));
    res.send(json.accounts[index]);
    logger.info(`POST /account - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account/transaction ${err.message}`);
  }
});

export default router;
