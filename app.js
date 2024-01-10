/** @format */

const {  } = require('./src/bridges');

const express = require('express');
const app = express();
const port = 9000;

try {
  // Main API
  // app.use(RouterMain);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
