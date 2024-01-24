/** @format */

import { createRequire } from 'module';
import { CreateCategory, DeleteCategoryByID, GetCategories, GetCategoryByID, UpdateCategoryByID } from '../functions/category.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  try {
    return await CreateCategory(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    return await GetCategories(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/:id', async (req, res) => {
  try {
    return await GetCategoryByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    return await UpdateCategoryByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    return await UpdateCategoryByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    return await DeleteCategoryByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    return await DeleteCategoryByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;