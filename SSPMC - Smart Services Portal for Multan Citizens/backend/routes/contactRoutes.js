import express from 'express';
import { createContactSubmission } from '../controllers/contactController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const contactRouter = express.Router();

// Both registered users and guest visitors hit this exact same endpoint
contactRouter.post('/feedback', authenticate, createContactSubmission);

export default contactRouter;