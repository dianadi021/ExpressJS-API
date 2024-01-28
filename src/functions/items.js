/** @format */

import { CreateTotalStockItem, DeleteTotalStockByID, UpdateTotalStockByID } from '../functions/totalStockItem.js';
import { FormatItemModel, ItemsModel, mongoose } from '../models/items.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../utils/utils.js';

export const CreateItem = async (req, res) => {
  try {
    const { itemName, itemPublisher, itemCategories, unitOfMeasurement } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { itemStock, itemModalPrice, itemSellPrice } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (!itemName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatItemModel });
    }

    const isEmptyItemName = CheckingIsNilValue(itemName);

    if (isEmptyItemName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatItemModel });
    }

    const newItem = ItemsModel({
      itemName: itemName.toLowerCase(),
      itemPublisher,
      itemCategories,
      unitOfMeasurement,
      itemStock,
      itemModalPrice,
      itemSellPrice,
    });

    let [isSuccessSaved, msgErr] = [false, 'err'];
    await newItem
      .save()
      .then((result) => {
        isSuccessSaved = true;
      })
      .catch((err) => {
        [isSuccessSaved, msgErr] = [false, err];
      });

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Catch: ${msgErr}` });
    }

    return await CreateTotalStockItem(req, res).then((result) => {
      const [isSuccess, msg] = result;
      if (!isSuccess) {
        res.status(500).json({ status: 'failed', messages: `Gagal menyimpan total stock dan produk Catch: ${msg}` });
      }
      res.status(201).json({ status: 'success', messages: `Berhasil menyimpan total stock dan produk. ${msg}` });
    });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan produk. Function Catch: ${err}` });
  }
};

export const GetItems = async (req, res) => {
  try {
    const syntaxExec = ['itemName', 'itemCategories', 'itemPublisher', 'page', 'document'];
    const { itemName, itemCategories, itemPublisher, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && (itemName || itemCategories)) {
      let toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;
      toFilter = itemCategories ? { itemCategories: itemCategories } : toFilter;

      const documentsInDB = await ItemsModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'itemCategories',
            foreignField: '_id',
            as: 'itemCategories',
          },
        },
        {
          $lookup: {
            from: 'publishers',
            localField: 'itemPublisher',
            foreignField: '_id',
            as: 'itemPublisher',
          },
        },
        { $match: toFilter },
      ]);

      if (documentsInDB.length >= 1) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await ItemsModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await ItemsModel.aggregate([
      { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'itemCategories',
          foreignField: '_id',
          as: 'itemCategories',
        },
      },
      {
        $lookup: {
          from: 'publishers',
          localField: 'itemPublisher',
          foreignField: '_id',
          as: 'itemPublisher',
        },
      },
    ]);

    if (documentsInDB.length >= 1) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};

export const GetItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await ItemsModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'itemCategories',
          foreignField: '_id',
          as: 'itemCategories',
        },
      },
      {
        $lookup: {
          from: 'publishers',
          localField: 'itemPublisher',
          foreignField: '_id',
          as: 'itemPublisher',
        },
      },
    ]);

    documentsInDB = !documentsInDB ? await ItemsModel.findById(id) : documentsInDB;

    if (!documentsInDB || documentsInDB.length < 1) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};

export const UpdateItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await ItemsModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { itemName, itemPublisher, itemCategories, unitOfMeasurement } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { itemStock, itemModalPrice, itemSellPrice } = CheckingKeyReq(req.body, req.query, req.body.data);
    let updateItem = {};

    if (!itemName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatItemModel });
    }

    // const isItemNameUsed = await ItemsModel.aggregate([{ $match: { itemName: itemName.toLowerCase() } }]);

    // if (isItemNameUsed.length >= 1) {
    //   return res
    //     .status(403)
    //     .json({ status: 'failed', messages: `Nama produk sudah terdaftar! Silahkan untuk mengganti nama atau kategori.` });
    // }

    updateItem = CheckingObjectValue(updateItem, { itemName });
    updateItem = CheckingObjectValue(updateItem, { itemPublisher });
    updateItem = CheckingObjectValue(updateItem, {
      itemCategories: CheckingIsNilValue(itemCategories) ? null : itemCategories ? Array.from(new Set(itemCategories)) : itemCategories,
    });
    updateItem = CheckingObjectValue(updateItem, { unitOfMeasurement });
    updateItem = CheckingObjectValue(updateItem, { itemStock });
    updateItem = CheckingObjectValue(updateItem, { itemModalPrice });
    updateItem = CheckingObjectValue(updateItem, { itemSellPrice });

    let [isSuccessSaved, msgErr] = [false, 'err'];
    await UpdateTotalStockByID(req, res, documentsInDB, updateItem).then((result) => {
      [isSuccessSaved, msgErr] = result;
    });

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Catch: ${msgErr}` });
    }

    return await ItemsModel.findByIdAndUpdate(id, updateItem)
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil memperbaharui produk. ${msgErr}` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msgErr}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};

export const DeleteItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await ItemsModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    let [isSuccessSaved, msgErr] = await DeleteTotalStockByID(req, res, true).then((result) => result);

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Catch: ${msgErr}` });
    }

    return await ItemsModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};
