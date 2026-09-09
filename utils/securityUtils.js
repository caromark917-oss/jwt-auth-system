const crypto = require('crypto');

// Rate limiting store (in production, use Redis)
const rateLimitStore = {};

// Check rate limit
const checkRateLimit = (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { attempts: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  const record = rateLimitStore[key];
  
  // Reset if window expired
  if (now > record.resetTime) {
    record.attempts = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Check if limit exceeded
  if (record.attempts >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }
  
  record.attempts++;
  return { allowed: true, remaining: maxAttempts - record.attempts };
};

// Reset rate limit
const resetRateLimit = (key) => {
  delete rateLimitStore[key];
};

// Generate crypto token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash token
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  checkRateLimit,
  resetRateLimit,
  generateToken,
  hashToken,
};
