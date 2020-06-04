const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

router.post('/', async (req, res) => {
  let account = req.body;

  try {
    const data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    const data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    delete json.nextId;
    res.send(json);
  } catch {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await fs.readFile(global.fileName, 'utf8');
    const json = JSON.parse(data);
    const account = json.accounts.find((account) => account.id === id);

    account ? res.send(account) : res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const accounts = json.accounts.filter((account) => account.id !== id);
    json.accounts = accounts;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  const newAccount = req.body;
  let data = await fs.readFile(global.fileName, 'utf8');

  let json = JSON.parse(data);
  // prettier-ignore
  const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id);

  const { name, balance } = newAccount;

  json.accounts[oldIndex].name = name;
  json.accounts[oldIndex].balance = balance;

  await fs.writeFile(global.fileName, JSON.stringify(json));
  res.end();
  try {
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/transaction', async (req, res) => {
  const params = req.body;

  try {
    const data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    // prettier-ignore
    const index = json.accounts.findIndex(account => account.id === params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error('Não há saldo suficiente para saque');
    }

    json.accounts[index].balance += params.value;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.send(json.accounts[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
