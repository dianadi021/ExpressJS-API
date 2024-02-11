/** @format */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const port = 9000;

import { brands, categories, main, restockItems, sellingItems, totalStockItem } from '../bridges.js';

try {
  // API ENDPOINT
  app.use('/api/main/', main);
  app.use('/api/brands', brands);
  app.use('/api/categories', categories);
  app.use('/api/items/total/stock', totalStockItem);
  app.use('/api/items/restock', restockItems);
  app.use('/api/items/selling', sellingItems);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
