/** @format */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const port = 9000;

import { brands, category, item, main, totalStockItem } from '../bridges.js';

try {
  // Main API
  app.use(main);
  app.use('/items', item);
  app.use('/categories', category);
  app.use('/brands', brands);
  app.use('/item/total/stock', totalStockItem);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
