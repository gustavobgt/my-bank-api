let express = require('express');
let router = express.Router();
let fs = require('fs');

router.post('/', (req, res) => {
  let account = req.body;

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/:id', (req, res) => {
  let id = parseInt(req.params.id, 10);

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      const account = json.accounts.find((account) => account.id === id);
      account ? res.send(account) : res.end();
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete('/:id', (req, res) => {
  let id = parseInt(req.params.id, 10);

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      const accounts = json.accounts.filter((account) => account.id !== id);
      json.accounts = accounts;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put('/', (req, res) => {
  let newAccount = req.body;

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      json = JSON.parse(data);
      // prettier-ignore
      const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id);

      const { name, balance } = newAccount;

      json.accounts[oldIndex].name = name;
      json.accounts[oldIndex].balance = balance;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.post('/transaction', (req, res) => {
  let params = req.body;

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      json = JSON.parse(data);
      // prettier-ignore
      const index = json.accounts.findIndex(account => account.id === params.id);

      if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
        throw new Error('Não há saldo suficiente para saque');
      }

      json.accounts[index].balance += params.value;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          // prettier-ignore
          res.send(json.accounts[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;
