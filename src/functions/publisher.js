/** @format */

import { FormatPublisherModel, PublisherModel } from '../models/publisher.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../utils/utils.js';

export const CreateItemPublisher = async (req, res) => {
  try {
    const { namePublisher } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (!namePublisher) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatPublisherModel });
    }

    const isEmptyNamePublisher = CheckingIsNilValue(namePublisher);

    if (isEmptyNamePublisher) {
      return res
        .status(404)
        .json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatPublisherModel });
    }

    const isNamePublisherUsed = await PublisherModel.aggregate([{ $match: { namePublisher: namePublisher.toLowerCase() } }]);

    if (isNamePublisherUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: 'failed', messages: `Nama publisher sudah terdaftar! Silahkan untuk mengganti nama publisher.` });
    }

    const newPublisher = PublisherModel({ namePublisher: namePublisher.toLowerCase() });

    return await newPublisher
      .save()
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil menyimpan publisher.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menyimpan publisher. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan publisher. Function Catch: ${err}` });
  }
};

export const GetPublishers = async (req, res) => {
  try {
    const syntaxExec = ['namePublisher', 'page', 'document'];
    const { namePublisher, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && namePublisher) {
      const toFilter = namePublisher ? { namePublisher: namePublisher.toLowerCase() } : false;

      const documentsInDB = await PublisherModel.aggregate([{ $project: { _id: 1, namePublisher: 1 } }, { $match: toFilter }]);

      if (documentsInDB.length >= 1) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await PublisherModel.aggregate([
        { $project: { _id: 1, namePublisher: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await PublisherModel.aggregate([{ $project: { _id: 1, namePublisher: 1 } }]);

    if (documentsInDB.length >= 1) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil publisher. Function Catch: ${err}` });
  }
};

export const GetPublisherByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await PublisherModel.findById(id);

    if (documentsInDB.length < 1) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil publisher. Function Catch: ${err}` });
  }
};

export const UpdatePublisherByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await PublisherModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { namePublisher } = CheckingKeyReq(req.body, req.query, req.body.data);
    let updatePublisher = {};

    if (!namePublisher) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatPublisherModel });
    }

    const isNamePublisherUsed = await PublisherModel.aggregate([{ $match: { namePublisher: namePublisher.toLowerCase() } }]);

    if (isNamePublisherUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: 'failed', messages: `Nama publisher sudah terdaftar! Silahkan untuk mengganti nama publisher.` });
    }

    updatePublisher = CheckingObjectValue(updatePublisher, { namePublisher });

    return await PublisherModel.findByIdAndUpdate(id, updatePublisher)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil publisher. Function Catch: ${err}` });
  }
};

export const DeletePublisherByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await PublisherModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return await PublisherModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil publisher. Function Catch: ${err}` });
  }
};
