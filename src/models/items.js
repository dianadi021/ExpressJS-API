/** @format */

import mongooseDB from '../app/connect.js';

const ItemsSchema = mongooseDB.Schema(
  {
    itemName: { type: String, required: true },
    itemPublisher: { type: mongooseDB.Schema.Types.ObjectId, ref: 'Publisher' },
    itemCategories: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Categories' }],
    unitOfMeasurement: { type: mongooseDB.Schema.Types.ObjectId, ref: 'itemUnitMeasurement' },
    itemStock: { type: Number, required: true },
    itemModalPrice: { type: Number, required: true },
    itemSellPrice: { type: Number, required: true },
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

export const mongoose = mongooseDB;

export const ItemsModel = mongooseDB.model('Item', ItemsSchema);

export const FormatItemModel = {
  itemName: 'String',
  itemPublisher: 'String',
  itemCategories: ['String'],
  unitOfMeasurement: 'String',
  itemStock: 'Number',
  itemModalPrice: 'Number',
  itemSellPrice: 'Number',
};
