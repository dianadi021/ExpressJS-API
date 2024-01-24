/** @format */

import mongooseDB from '../app/connect.js';
const PublisherSchema = mongooseDB.Schema(
  {
    namePublisher: { type: String, required: true },
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

export const PublisherModel = mongooseDB.model('Publisher', PublisherSchema);

export const FormatPublisherModel = { namePublisher: 'String' };
