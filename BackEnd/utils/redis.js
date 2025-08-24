import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Check if Redis URL is provided, otherwise use default
      const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
      
      console.log('🔗 Attempting to connect to Redis at:', redisUrl);
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('Redis connection failed after 10 retries');
              return false;
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('✅ Redis client ready');
      });

      this.client.on('end', () => {
        console.log('❌ Redis connection ended');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Redis connection failed:', error.message);
      console.log('⚠️  Continuing without Redis - some features will be limited');
      this.isConnected = false;
      return null;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Session Management
  async setSession(userId, sessionData, ttl = 3600) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `session:${userId}`;
      return await this.client.setEx(key, ttl, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Redis setSession error:', error.message);
      return false;
    }
  }

  async getSession(userId) {
    if (!this.isConnected || !this.client) return null;
    try {
      const key = `session:${userId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis getSession error:', error.message);
      return null;
    }
  }

  async deleteSession(userId) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `session:${userId}`;
      return await this.client.del(key);
    } catch (error) {
      console.error('Redis deleteSession error:', error.message);
      return false;
    }
  }

  // Match Data Caching
  async setMatchData(sportType, matchId, matchData, ttl = 7200) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `match:${sportType}:${matchId}`;
      return await this.client.setEx(key, ttl, JSON.stringify(matchData));
    } catch (error) {
      console.error('Redis setMatchData error:', error.message);
      return false;
    }
  }

  async getMatchData(sportType, matchId) {
    if (!this.isConnected || !this.client) return null;
    try {
      const key = `match:${sportType}:${matchId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis getMatchData error:', error.message);
      return null;
    }
  }

  async deleteMatchData(sportType, matchId) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `match:${sportType}:${matchId}`;
      return await this.client.del(key);
    } catch (error) {
      console.error('Redis deleteMatchData error:', error.message);
      return false;
    }
  }

  // Chat Message Caching
  async addChatMessage(sportName, message, maxMessages = 1000) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `chat:${sportName}`;
      await this.client.lPush(key, JSON.stringify(message));
      await this.client.lTrim(key, 0, maxMessages - 1);
      await this.client.expire(key, 86400); // 24 hour TTL
      return true;
    } catch (error) {
      console.error('Redis addChatMessage error:', error.message);
      return false;
    }
  }

  async getChatMessages(sportName, limit = 50) {
    if (!this.isConnected || !this.client) return [];
    try {
      const key = `chat:${sportName}`;
      const messages = await this.client.lRange(key, 0, limit - 1);
      return messages.map(msg => JSON.parse(msg)).reverse();
    } catch (error) {
      console.error('Redis getChatMessages error:', error.message);
      return [];
    }
  }

  // Rate Limiting
  async incrementRateLimit(userId, endpoint, window = 60) {
    if (!this.isConnected || !this.client) return { count: 0, limit: 100 };
    try {
      const key = `ratelimit:${userId}:${endpoint}`;
      const count = await this.client.incr(key);
      if (count === 1) {
        await this.client.expire(key, window);
      }
      return { count, limit: 100 };
    } catch (error) {
      console.error('Redis incrementRateLimit error:', error.message);
      return { count: 0, limit: 100 };
    }
  }

  // Statistics
  async incrementStat(category, field, value = 1) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `stats:${category}`;
      return await this.client.hIncrBy(key, field, value);
    } catch (error) {
      console.error('Redis incrementStat error:', error.message);
      return false;
    }
  }

  async getStats(category) {
    if (!this.isConnected || !this.client) return {};
    try {
      const key = `stats:${category}`;
      return await this.client.hGetAll(key);
    } catch (error) {
      console.error('Redis getStats error:', error.message);
      return {};
    }
  }

  // Leaderboard
  async addToLeaderboard(leaderboardName, userId, score) {
    if (!this.isConnected || !this.client) return false;
    try {
      const key = `leaderboard:${leaderboardName}`;
      return await this.client.zAdd(key, [{ score, value: userId }]);
    } catch (error) {
      console.error('Redis addToLeaderboard error:', error.message);
      return false;
    }
  }

  async getLeaderboard(leaderboardName, limit = 10) {
    if (!this.isConnected || !this.client) return [];
    try {
      const key = `leaderboard:${leaderboardName}`;
      return await this.client.zRevRangeWithScores(key, 0, limit - 1);
    } catch (error) {
      console.error('Redis getLeaderboard error:', error.message);
      return [];
    }
  }

  // Health Check
  async ping() {
    if (!this.isConnected || !this.client) return false;
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis ping error:', error.message);
      return false;
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

export default redisClient;
