const mongoose = require('mongoose');
const Requirement = require('../models/Requirement.models.js');
const Register = require('../models/register.models.js');

const createRequirement = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const user = await Register.findById(req.user.userId).select('_id');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const requirement = await Requirement.create({
      user: user._id,
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || 'General',
      priority: priority || 'Medium'
    });

    res.status(201).json({ message: 'Requirement submitted successfully.', requirement });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Failed to submit requirement.', error: error.message });
  }
};

const getMyRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ requirements });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load your requirements.', error: error.message });
  }
};

const getAllRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find()
      .populate('user', 'name email number role')
      .sort({ createdAt: -1 });
    res.json({ requirements });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load requirements.', error: error.message });
  }
};

const updateRequirementStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid requirement status.' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid requirement id.' });
    }

    const requirement = await Requirement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email number role');
    if (!requirement) return res.status(404).json({ message: 'Requirement not found.' });
    res.json({ message: 'Requirement status updated.', requirement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update requirement status.', error: error.message });
  }
};

module.exports = {
  createRequirement,
  getMyRequirements,
  getAllRequirements,
  updateRequirementStatus
};