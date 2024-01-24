/** @format */

import { mongoConnect } from './app/connect.js';
import rCategory from './routes/category.js';
import rItem from './routes/items.js';
import rMain from './routes/main.js';
import rPublisher from './routes/publisher.js';
import rTotalStockItem from './routes/totalStockItem.js';

mongoConnect();

export const main = rMain;
export const item = rItem;
export const category = rCategory;
export const publisher = rPublisher;
export const totalStockItem = rTotalStockItem;
