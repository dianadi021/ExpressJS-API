/** @format */

import { createRequire } from 'module';
import { CreateMain, DeleteMainByID, GetMain, GetMainByID, UpdateMainByID } from '../functions/main.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  try {
    return await CreateMain(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    return await GetMain(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/main/:id', async (req, res) => {
  try {
    return await GetMainByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/main/update/:id', async (req, res) => {
  try {
    return await UpdateMainByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/main/:id', async (req, res) => {
  try {
    return await UpdateMainByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/main/delete/:id', async (req, res) => {
  try {
    return await DeleteMainByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/main/:id', async (req, res) => {
  try {
    return await DeleteMainByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
