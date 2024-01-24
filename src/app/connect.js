/** @format */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

const dbName = 'BasicCRUD';
const urlServer = `mongodb://localhost:27017/${dbName}`;

export const mongoConnect = async () => {
  try {
    await mongoose
      .connect(`${urlServer}`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((result) => {
        console.log('Success connected to MongoDB!');
      })
      .catch((err) => {
        console.error(`Connection error to MongoDB ${err}`);
      });
  } catch (err) {
    console.error(`Connection error to MongoDB ${err}`);
  }
};

export default mongoose;