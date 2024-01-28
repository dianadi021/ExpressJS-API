/** @format */

import mongooseDB from '../app/connect.js';
const BrandSchema = mongooseDB.Schema(
  {
    nameBrand: { type: String, required: true },
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

export const BrandModel = mongooseDB.model('Brand', BrandSchema);

export const FormatBrandModel = { nameBrand: 'String' };
