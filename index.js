let express = require('express');
let app = express();
let fs = require('fs').promises;
let accountsRouter = require('./routes/accounts.js');

global.fileName = 'accounts.json';

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName, 'utf8');
    console.log('API Started!');
  } catch (err) {
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

// Fica rodando esperando noas requisições
