let express = require('express');
let fs = require('fs');

let app = express();

app.use(express.json());

app.post('/account', (req, res) => {
  let account = req.body;

  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (!err) {
      try {
        let json = JSON.parse(data);
        account = { id: json.nextId++, ...account };
        json.accounts.push(account);

        fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
          if (err) {
            res.status(400).send({ error: err.message });
          } else {
            res.end();
          }
        });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

app.listen(3000, () => {
  try {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };

        fs.writeFile('accounts.json', JSON.stringify(initialJson), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  console.log('API Started!');
});

// Fica rodando esperando noas requisições
