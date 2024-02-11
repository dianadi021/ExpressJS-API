/** @format */

import { mongoConnect } from './app/connect.js';
import rBrands from './routes/brands.js';
import rCategories from './routes/categories.js';
import rMain from './routes/main.js';
import rRestockItems from './routes/restockItems.js';
import rSellingItems from './routes/sellingItems.js';
import rTotalStockItems from './routes/totalStockItems.js';

mongoConnect();

export const main = rMain;
export const restockItems = rRestockItems;
export const categories = rCategories;
export const brands = rBrands;
export const totalStockItem = rTotalStockItems;
export const sellingItems = rSellingItems;
