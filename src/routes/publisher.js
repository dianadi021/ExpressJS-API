/** @format */

import { createRequire } from 'module';
import { CreateItemPublisher, DeletePublisherByID, GetPublisherByID, GetPublishers, UpdatePublisherByID } from '../functions/publisher.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  try {
    return await CreateItemPublisher(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    return await GetPublishers(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/:id', async (req, res) => {
  try {
    return await GetPublisherByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    return await UpdatePublisherByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    return await UpdatePublisherByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    return await DeletePublisherByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    return await DeletePublisherByID(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
