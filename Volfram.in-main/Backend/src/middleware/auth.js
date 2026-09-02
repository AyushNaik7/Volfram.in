const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT access token from Authorization header
 * Protects admin routes
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access token expired. Please refresh your token.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }

    res.status(500).json({ 
      message: 'Server error during authentication.',
      error: error.message 
    });
  }
};

/**
 * Admin Role Middleware
 * Checks if authenticated user has admin role
 */
const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during authorization.',
      error: error.message 
    });
  }
};

module.exports = { authMiddleware, adminMiddleware };
