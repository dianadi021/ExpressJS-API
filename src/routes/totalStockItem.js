/** @format */

import { createRequire } from 'module';
import {
  CreateTotalStockItem,
  DeleteTotalStockByID,
  GetTotalStockItemByID,
  GetTotalStockItems,
  UpdateTotalStockByID,
} from '../functions/totalStockItem.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  try {
    return await CreateTotalStockItem(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    return await GetTotalStockItems(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/:id', async (req, res) => {
  try {
    return await GetTotalStockItemByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    return await UpdateTotalStockByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    return await UpdateTotalStockByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    return await UpdateTotalStockByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    return await DeleteTotalStockByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
