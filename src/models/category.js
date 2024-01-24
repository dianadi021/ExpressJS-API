/** @format */

import mongooseDB from '../app/connect.js';

const CategoriesSchema = mongooseDB.Schema(
  {
    categoryName: { type: String, required: true },
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

export const CategoriesModel = mongooseDB.model('Category', CategoriesSchema);

export const FormatCategoryModel = { categoryName: 'String' };
