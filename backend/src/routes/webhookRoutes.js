import express from 'express';
import { handleGoogleFormWebhook } from '../controllers/submissionController.js';

const router = express.Router();

// Webhook endpoint called by Google Apps Script onFormSubmit
router.post('/google-form', handleGoogleFormWebhook);

// Health check endpoint for webhooks
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Google Form Webhook receiver is ready!',
  });
});

export default router;
