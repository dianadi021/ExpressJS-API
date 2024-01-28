/** @format */

import { BrandModel, FormatBrandModel } from '../models/brands.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../utils/utils.js';

export const CreateItemBrand = async (req, res) => {
  try {
    const { nameBrand } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (!nameBrand) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatBrandModel });
    }

    const isEmptyNameBrand = CheckingIsNilValue(nameBrand);

    if (isEmptyNameBrand) {
      return res
        .status(404)
        .json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatBrandModel });
    }

    const isNameBrandUsed = await BrandModel.aggregate([{ $match: { nameBrand: nameBrand.toLowerCase() } }]);

    if (isNameBrandUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: 'failed', messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama Brand.` });
    }

    const newBrand = BrandModel({ nameBrand: nameBrand.toLowerCase() });

    return await newBrand
      .save()
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil menyimpan Brand.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menyimpan Brand. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan Brand. Function Catch: ${err}` });
  }
};

export const GetBrands = async (req, res) => {
  try {
    const syntaxExec = ['nameBrand', 'page', 'document'];
    const { nameBrand, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && nameBrand) {
      const toFilter = nameBrand ? { nameBrand: nameBrand.toLowerCase() } : false;

      const documentsInDB = await BrandModel.aggregate([{ $project: { _id: 1, nameBrand: 1 } }, { $match: toFilter }]);

      if (documentsInDB.length >= 1) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await BrandModel.aggregate([
        { $project: { _id: 1, nameBrand: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await BrandModel.aggregate([{ $project: { _id: 1, nameBrand: 1 } }]);

    if (documentsInDB.length >= 1) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Brand. Function Catch: ${err}` });
  }
};

export const GetBrandByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await BrandModel.findById(id);

    if (documentsInDB.length < 1) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Brand. Function Catch: ${err}` });
  }
};

export const UpdateBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { nameBrand } = CheckingKeyReq(req.body, req.query, req.body.data);
    let updateBrand = {};

    if (!nameBrand) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatBrandModel });
    }

    const isNameBrandUsed = await BrandModel.aggregate([{ $match: { nameBrand: nameBrand.toLowerCase() } }]);

    if (isNameBrandUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: 'failed', messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama Brand.` });
    }

    updateBrand = CheckingObjectValue(updateBrand, { nameBrand });

    return await BrandModel.findByIdAndUpdate(id, updateBrand)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Brand. Function Catch: ${err}` });
  }
};

export const DeleteBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return await BrandModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Brand. Function Catch: ${err}` });
  }
};
