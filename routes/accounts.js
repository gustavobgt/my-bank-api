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
module.exports = router;
