import jwt from 'jsonwebtoken';

//Authentication Middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { role: 'unsigned' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    // SILENT REFRESH: Generate a brand new token with a fresh 1-hour lease
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the fresh token back to the frontend in a custom header
    res.setHeader('x-refresh-token', newToken);
    
    // Crucial: Allow the frontend browser to read this custom header
    res.setHeader('Access-Control-Expose-Headers', 'x-refresh-token');

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session token.' });
  }
};

//Authorization Middleware
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(500).json({ message: 'Auth middleware configuration error.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Role '${req.user.role}' is unauthorized for this action.` 
            });
        }

        next();
    };
};