/** @format */

import { CategoriesModel, FormatCategoryModel } from '../models/category.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../utils/utils.js';

export const CreateCategory = async (req, res) => {
  try {
    const { categoryName } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (!categoryName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatCategoryModel });
    }

    const isEmptyCategoryName = CheckingIsNilValue(categoryName);

    if (isEmptyCategoryName) {
      return res
        .status(404)
        .json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatCategoryModel });
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (isCategoryNameUsed.length >= 1) {
      return res.status(403).json({ status: 'failed', messages: `Nama kategori sudah terdaftar! Silahkan untuk mengganti nama kategori.` });
    }

    const newCategory = CategoriesModel({ categoryName: categoryName.toLowerCase() });

    return await newCategory
      .save()
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil menyimpan kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menyimpan kategori. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan kategori. Function Catch: ${err}` });
  }
};

export const GetCategories = async (req, res) => {
  try {
    const syntaxExec = ['categoryName', 'page', 'document'];
    const { categoryName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && categoryName) {
      const toFilter = categoryName ? { categoryName: categoryName.toLowerCase() } : false;

      const documentsInDB = await CategoriesModel.aggregate([{ $project: { _id: 1, categoryName: 1 } }, { $match: toFilter }]);

      if (documentsInDB.length >= 1) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await CategoriesModel.aggregate([
        { $project: { _id: 1, categoryName: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await CategoriesModel.aggregate([{ $project: { _id: 1, categoryName: 1 } }]);

    if (documentsInDB.length >= 1) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil kategori. Function Catch: ${err}` });
  }
};

export const GetCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await CategoriesModel.findById(id);

    if (documentsInDB.length < 1) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil kategori. Function Catch: ${err}` });
  }
};

export const UpdateCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { categoryName } = CheckingKeyReq(req.body, req.query, req.body.data);
    let updateCategory = {};

    if (!categoryName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatCategoryModel });
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (isCategoryNameUsed.length >= 1) {
      return res.status(403).json({ status: 'failed', messages: `Nama kategori sudah terdaftar! Silahkan untuk mengganti nama kategori.` });
    }

    updateCategory = CheckingObjectValue(updateCategory, { categoryName });

    return await CategoriesModel.findByIdAndUpdate(id, updateCategory)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil kategori. Function Catch: ${err}` });
  }
};

export const DeleteCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return await CategoriesModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil kategori. Function Catch: ${err}` });
  }
};
