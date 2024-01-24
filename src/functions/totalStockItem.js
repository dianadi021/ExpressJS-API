/** @format */

import { FormatTotalStockItemModel, ItemsModel, TotalStockItemModel, mongoose } from '../models/totalStockItem.js';
import { CheckingKeyReq, CheckingKeyReqSyntax } from '../utils/utils.js';

export const CreateTotalStockItem = async (req, res) => {
  try {
    const { itemName, itemPublisher, itemCategories } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { itemStock, itemModalPrice } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (!itemName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai!`, format: FormatTotalStockItemModel });
    }

    const isItemNameUsed = await TotalStockItemModel.aggregate([{ $match: { itemName: itemName.toLowerCase() } }]);
    const allIDFromItems = await ItemsModel.aggregate([
      { $match: { itemName: itemName.toLowerCase() } },
      { $project: { _id: 1, itemName: 1 } },
    ]);

    const listItems = new Array();

    allIDFromItems.forEach((list) => {
      const { _id } = list;
      if (list.itemName) {
        listItems.push(_id);
      }
    });

    if (isItemNameUsed.length >= 1) {
      const updateTotalStockItem = {
        itemName: itemName.toLowerCase(),
        itemPublisher,
        itemCategories,
        listItems,
        totalStockItem: isItemNameUsed[0].totalStockItem + itemStock,
        totalModalAsset: isItemNameUsed[0].totalModalAsset + itemModalPrice,
      };

      const mngodFilter = { itemName: itemName.toLowerCase() };
      return await TotalStockItemModel.findOneAndUpdate(mngodFilter, updateTotalStockItem)
        .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data.` }))
        .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data. Function Catch: ${err}` }));
    }

    // NOT FIXED IN HERE IF DELETED ALL
    // AND NOT CREATE ITEM AGAIN
    // NEED LOOPING AND NEW SET() ITEMS.MODEL
    const newTotalStockItem = TotalStockItemModel({
      itemName: itemName.toLowerCase(),
      itemPublisher,
      itemCategories,
      listItems,
      totalStockItem: itemStock,
      totalModalAsset: itemModalPrice,
    });

    return await newTotalStockItem
      .save()
      .then((result) => [true, `Berhasil menyimpan total stock produk`])
      .catch((err) => [false, err]);
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal memproses. Function Catch: ${err}` });
  }
};

export const GetTotalStockItems = async (req, res) => {
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

      const documentsInDB = await TotalStockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1, listItems: 1 } },
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
        {
          $lookup: {
            from: 'items',
            localField: 'listItems',
            foreignField: '_id',
            as: 'listItems',
          },
        },
        { $match: toFilter },
      ]);

      if (documentsInDB.length >= 1) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await TotalStockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1, listItems: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await TotalStockItemModel.aggregate([
      { $project: { _id: 1, itemName: 1, itemCategories: 1, itemPublisher: 1, listItems: 1 } },
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
      {
        $lookup: {
          from: 'items',
          localField: 'listItems',
          foreignField: '_id',
          as: 'listItems',
        },
      },
    ]);

    if (documentsInDB.length >= 1) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal memproses. Function Catch: ${err}` });
  }
};

export const GetTotalStockItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await TotalStockItemModel.aggregate([
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
      {
        $lookup: {
          from: 'items',
          localField: 'listItems',
          foreignField: '_id',
          as: 'listItems',
        },
      },
    ]);

    documentsInDB = !documentsInDB ? await TotalStockItemModel.findById(id) : documentsInDB;

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};

export const UpdateTotalStockByID = async (req, res, documentsItemInDB, update) => {
  try {
    const oldItemName = documentsItemInDB.itemName;
    const newItemName = update.itemName;

    const isOldItemNameUsed = await TotalStockItemModel.aggregate([{ $match: { itemName: oldItemName.toLowerCase() } }]);
    const isNewItemNameUsed = await TotalStockItemModel.aggregate([{ $match: { itemName: newItemName.toLowerCase() } }]);

    if (isNewItemNameUsed.length <= 1) {
      const newRowTotalStock = { body: update };
      return await CreateTotalStockItem(newRowTotalStock, res)
        .then((result) => result)
        .catch((err) => err);
    }

    if (isOldItemNameUsed.length >= 1) {
      update.itemName = oldItemName;
      const oldRowTotalStock = { body: update };
      return await CreateTotalStockItem(oldRowTotalStock, res)
        .then((result) => result)
        .catch((err) => err);
    }
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal memproses. Function Catch: ${err}` });
  }
};

export const DeleteTotalStockByID = async (req, res, idListItems) => {
  try {
    const { id } = req.params;
    const documentsInDB = await TotalStockItemModel.findById(id);

    if (!documentsInDB) {
      if (idListItems) {
        return await TotalStockItemModel.updateMany({ 'listItems._id': { $in: [id] } }, { $pull: { listItems: { _id: id } } })
          .then((result) => [true, `Berhasil menghapus produk di total stock`])
          .catch((err) => [false, err]);
      }

      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return await TotalStockItemModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil produk. Function Catch: ${err}` });
  }
};
