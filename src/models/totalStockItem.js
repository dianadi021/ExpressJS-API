/** @format */

import mongooseDB from '../app/connect.js';

const TotalStockItemSchema = mongooseDB.Schema(
  {
    itemName: { type: String, required: true },
    itemPublisher: { type: mongooseDB.Schema.Types.ObjectId, ref: 'Publisher' },
    itemCategories: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Categories' }],
    listItems: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Items' }],
    totalStockItem: { type: Number, required: true },
    totalModalAsset: { type: Number, required: true },
  },
  { timestamps: true },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);

import { ItemsModel as ItemModel } from './items.js';
export const ItemsModel = ItemModel;

export const mongoose = mongooseDB;

export const TotalStockItemModel = mongooseDB.model('TotalStockItem', TotalStockItemSchema);

export const FormatTotalStockItemModel = {
  itemName: 'String',
  itemPublisher: 'String',
  itemCategories: ['String'],
  listItems: ['String'],
  totalStockItem: 'Number',
  totalModalAsset: 'Number',
};
