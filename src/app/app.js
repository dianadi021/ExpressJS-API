/** @format */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const port = 9000;

import { category, item, main, publisher, totalStockItem } from '../bridges.js';

try {
  // Main API
  app.use(main);
  app.use('/item', item);
  app.use('/category', category);
  app.use('/publisher', publisher);
  app.use('/item/total/stock', totalStockItem);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
