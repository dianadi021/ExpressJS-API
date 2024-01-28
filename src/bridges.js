/** @format */

import { mongoConnect } from './app/connect.js';
import rBrands from './routes/brands.js';
import rCategory from './routes/category.js';
import rItem from './routes/items.js';
import rMain from './routes/main.js';
import rTotalStockItem from './routes/totalStockItem.js';

mongoConnect();

export const main = rMain;
export const item = rItem;
export const category = rCategory;
export const brands = rBrands;
export const totalStockItem = rTotalStockItem;
