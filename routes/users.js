const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshTokens');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.userId.toString() !== req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Update user profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (req.userId.toString() !== req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens');

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Change user role (Admin only)
router.put('/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, {
      new: true,
    }).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
});

// Deactivate account
router.patch('/:id/deactivate', verifyToken, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, {
      new: true,
    }).select('-password -refreshTokens');

    res.json({ message: 'Account deactivated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate account', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;