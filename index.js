let express = require('express');
let app = express();
let fs = require('fs');
let accountsRouter = require('./routes/accounts.js');

global.fileName = 'accounts.json';

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, () => {
  try {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };

        fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
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
