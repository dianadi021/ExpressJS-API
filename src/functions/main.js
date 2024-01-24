/** @format */

import { FormatMainModel, MainModel, mongoose } from '../models/main.js';
import { CheckingIsNilValue, CheckingKeyReq } from '../utils/utils.js';

export const CreateMain = async (req, res) => {
  try {
    MainModel.find();
    CheckingKeyReq(MainModel);
    CheckingIsNilValue(MainModel);
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMainModel });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetMain = async (req, res) => {
  try {
    MainModel.find();
    CheckingKeyReq(MainModel);
    CheckingIsNilValue(MainModel);
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMainModel });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetMainByID = async (req, res) => {
  try {
    MainModel.find();
    CheckingKeyReq(MainModel);
    CheckingIsNilValue(MainModel);
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMainModel });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const UpdateMainByID = async (req, res) => {
  try {
    MainModel.find();
    CheckingKeyReq(MainModel);
    CheckingIsNilValue(MainModel);
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMainModel });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const DeleteMainByID = async (req, res) => {
  try {
    MainModel.find();
    CheckingKeyReq(MainModel);
    CheckingIsNilValue(MainModel);
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMainModel });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

// module.exports = {
//   CreateMain,
//   GetMain,
//   GetMainByID,
//   UpdateMainByID,
//   DeleteMainByID,
// };
