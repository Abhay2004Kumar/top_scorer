import rateLimit from 'express-rate-limit';
import redisClient from '../utils/redis.js';

// Redis-based rate limiter
export const redisRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return async (req, res, next) => {
    try {
      // Get user identifier (IP or user ID)
      const identifier = req.user?.id || req.ip;
      const endpoint = req.originalUrl;

      // Check rate limit using Redis
      const { count, limit } = await redisClient.incrementRateLimit(
        identifier,
        endpoint,
        Math.floor(windowMs / 1000)
      );

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': Math.max(0, limit - count),
        'X-RateLimit-Reset': Date.now() + windowMs
      });

      // Check if limit exceeded
      if (count > limit) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If Redis fails, allow the request to proceed
      next();
    }
  };
};

// Different rate limits for different endpoints
export const authRateLimit = redisRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes for auth
export const apiRateLimit = redisRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes for API
export const chatRateLimit = redisRateLimiter(60 * 1000, 30); // 30 messages per minute for chat
export const paymentRateLimit = redisRateLimiter(60 * 60 * 1000, 10); // 10 payments per hour

// Memory-based fallback rate limiter
export const memoryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting based on endpoint
export const dynamicRateLimit = (req, res, next) => {
  const path = req.path;
  
  if (path.includes('/auth') || path.includes('/login') || path.includes('/signup')) {
    return authRateLimit(req, res, next);
  }
  
  if (path.includes('/chat')) {
    return chatRateLimit(req, res, next);
  }
  
  if (path.includes('/payment')) {
    return paymentRateLimit(req, res, next);
  }
  
  return apiRateLimit(req, res, next);
};
