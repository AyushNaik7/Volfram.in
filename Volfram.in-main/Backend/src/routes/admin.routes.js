const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Page = require('../models/Page');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter - accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

/**
 * GET /api/admin/pages
 * Get all pages
 * Protected route - requires authentication and admin role
 */
router.get('/pages', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Pages retrieved successfully',
      count: pages.length,
      pages: pages
    });

  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      message: 'Server error while fetching pages.',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/pages
 * Create new page with photo upload
 * Protected route - requires authentication and admin role
 */
router.post('/pages', authMiddleware, adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        message: 'Title is required.'
      });
    }

    // Get uploaded file path if exists
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new page
    const newPage = new Page({
      title,
      description,
      imageUrl,
      category
    });

    await newPage.save();

    res.status(201).json({
      message: 'Page created successfully',
      page: newPage
    });

  } catch (error) {
    console.error('Error creating page:', error);
    
    // Delete uploaded file if page creation fails
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Server error while creating page.',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/pages/:id
 * Update page with optional photo update
 * Protected route - requires authentication and admin role
 */
router.put('/pages/:id', authMiddleware, adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    // Find existing page
    const page = await Page.findById(id);
    
    if (!page) {
      return res.status(404).json({
        message: 'Page not found.'
      });
    }

    // Update fields
    if (title) page.title = title;
    if (description !== undefined) page.description = description;
    if (category !== undefined) page.category = category;

    // Handle photo update
    if (req.file) {
      // Delete old image if exists
      if (page.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', page.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image URL
      page.imageUrl = `/uploads/${req.file.filename}`;
    }

    page.updatedAt = Date.now();
    await page.save();

    res.status(200).json({
      message: 'Page updated successfully',
      page: page
    });

  } catch (error) {
    console.error('Error updating page:', error);
    
    // Delete uploaded file if update fails
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Server error while updating page.',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/pages/:id
 * Delete page
 * Protected route - requires authentication and admin role
 */
router.delete('/pages/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete page
    const page = await Page.findById(id);
    
    if (!page) {
      return res.status(404).json({
        message: 'Page not found.'
      });
    }

    // Delete associated image file if exists
    if (page.imageUrl) {
      const imagePath = path.join(__dirname, '../../', page.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Page.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Page deleted successfully',
      deletedPage: page
    });

  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({
      message: 'Server error while deleting page.',
      error: error.message
    });
  }
});

// ─── IMAGE MANAGER ROUTES ────────────────────────────────────────────────────

const SiteImage = require('../models/SiteImage');

// Configure multer for multiple image upload (reuse existing storage + fileFilter)
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

/**
 * GET /api/admin/images/:section
 * Get all images for a section
 * sections: gallery | events | clients | about | products
 */
router.get('/images/:section', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const images = await SiteImage.find({ section }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images.', error: error.message });
  }
});

/**
 * POST /api/admin/images/:section
 * Upload multiple images for a section
 * Field name: 'photos' (array)
 */
router.post('/images/:section', authMiddleware, adminMiddleware, uploadMultiple.array('photos', 20), async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['gallery', 'events', 'clients', 'about', 'products'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section.' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    
    const captions = req.body.captions
      ? (Array.isArray(req.body.captions) ? req.body.captions : [req.body.captions])
      : [];
    
    const savedImages = await Promise.all(
      req.files.map((file, index) =>
        new SiteImage({
          section,
          imageUrl: `/uploads/${file.filename}`,
          caption: captions[index] || ''
        }).save()
      )
    );
    
    res.status(201).json({ message: `${savedImages.length} image(s) uploaded.`, images: savedImages });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images.', error: error.message });
  }
});

/**
 * DELETE /api/admin/images/:id
 * Delete one image by its MongoDB _id
 */
router.delete('/images/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const image = await SiteImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found.' });
    
    // Delete physical file
    const filePath = path.join(__dirname, '../../', image.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    await SiteImage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image.', error: error.message });
  }
});

module.exports = router;
