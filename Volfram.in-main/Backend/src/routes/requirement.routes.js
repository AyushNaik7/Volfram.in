const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  createRequirement,
  getMyRequirements,
  getAllRequirements,
  updateRequirementStatus
} = require('../controllers/requirement.controllers');

const router = express.Router();

router.post('/requirements', authMiddleware, createRequirement);
router.get('/requirements/my-requirements', authMiddleware, getMyRequirements);
router.get('/requirements', authMiddleware, adminMiddleware, getAllRequirements);
router.put('/requirements/:id/status', authMiddleware, adminMiddleware, updateRequirementStatus);

module.exports = router;