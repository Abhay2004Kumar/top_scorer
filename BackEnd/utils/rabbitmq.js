import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.queues = {
      MATCH_UPDATES: 'match-updates',
      NOTIFICATIONS: 'notifications',
      BLOG_SUBMISSIONS: 'blog-submissions',
      PAYMENT_PROCESSING: 'payment-processing',
      DATA_SYNC: 'data-sync',
      EMAIL_NOTIFICATIONS: 'email-notifications'
    };
  }

  async connect() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';
      
      console.log('🔗 Attempting to connect to RabbitMQ at:', url);
      
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;

      console.log('✅ RabbitMQ connected successfully');

      // Setup queues
      await this.setupQueues();

      // Handle connection events
      this.connection.on('error', (err) => {
        console.error('❌ RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        console.log('❌ RabbitMQ connection closed');
        this.isConnected = false;
      });

      return this.channel;
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error.message);
      console.log('⚠️  Continuing without RabbitMQ - some features will be limited');
      this.isConnected = false;
      return null;
    }
  }

  async setupQueues() {
    if (!this.channel) return;

    try {
      // Assert all queues with proper configurations
      await this.channel.assertQueue(this.queues.MATCH_UPDATES, {
        durable: true,
        arguments: {
          'x-message-ttl': 300000, // 5 minutes TTL
          'x-max-length': 10000
        }
      });

      await this.channel.assertQueue(this.queues.NOTIFICATIONS, {
        durable: true,
        arguments: {
          'x-message-ttl': 86400000, // 24 hours TTL
          'x-max-length': 50000
        }
      });

      await this.channel.assertQueue(this.queues.BLOG_SUBMISSIONS, {
        durable: true,
        arguments: {
          'x-message-ttl': 604800000, // 7 days TTL
          'x-max-length': 1000
        }
      });

      await this.channel.assertQueue(this.queues.PAYMENT_PROCESSING, {
        durable: true,
        arguments: {
          'x-message-ttl': 300000, // 5 minutes TTL
          'x-max-length': 1000
        }
      });

      await this.channel.assertQueue(this.queues.DATA_SYNC, {
        durable: true,
        arguments: {
          'x-message-ttl': 60000, // 1 minute TTL
          'x-max-length': 10000
        }
      });

      await this.channel.assertQueue(this.queues.EMAIL_NOTIFICATIONS, {
        durable: true,
        arguments: {
          'x-message-ttl': 3600000, // 1 hour TTL
          'x-max-length': 10000
        }
      });

      console.log('✅ RabbitMQ queues setup completed');
    } catch (error) {
      console.error('❌ RabbitMQ queue setup failed:', error.message);
    }
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
    } catch (error) {
      console.error('RabbitMQ disconnect error:', error.message);
    }
  }

  // Send message to queue
  async sendToQueue(queueName, message, options = {}) {
    if (!this.isConnected || !this.channel) {
      console.log('⚠️  RabbitMQ not connected, skipping message:', queueName);
      return false;
    }

    try {
      const defaultOptions = {
        persistent: true,
        timestamp: Date.now()
      };

      const finalOptions = { ...defaultOptions, ...options };

      return this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        finalOptions
      );
    } catch (error) {
      console.error('RabbitMQ sendToQueue error:', error.message);
      return false;
    }
  }

  // Consume messages from queue
  async consumeQueue(queueName, callback, options = {}) {
    if (!this.isConnected || !this.channel) {
      console.log('⚠️  RabbitMQ not connected, skipping consumer setup:', queueName);
      return false;
    }

    try {
      const defaultOptions = {
        noAck: false,
        prefetch: 1
      };

      const finalOptions = { ...defaultOptions, ...options };

      return this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content, msg);
            this.channel.ack(msg);
          } catch (error) {
            console.error(`Error processing message from ${queueName}:`, error);
            // Reject message and requeue if it's a temporary error
            this.channel.nack(msg, false, true);
          }
        }
      }, finalOptions);
    } catch (error) {
      console.error('RabbitMQ consumeQueue error:', error.message);
      return false;
    }
  }

  // Match Updates
  async sendMatchUpdate(updateData) {
    return this.sendToQueue(this.queues.MATCH_UPDATES, {
      ...updateData,
      timestamp: Date.now()
    });
  }

  // Notifications
  async sendNotification(notificationData) {
    return this.sendToQueue(this.queues.NOTIFICATIONS, {
      ...notificationData,
      timestamp: Date.now()
    });
  }

  // Blog Submissions
  async sendBlogSubmission(blogData) {
    return this.sendToQueue(this.queues.BLOG_SUBMISSIONS, {
      ...blogData,
      timestamp: Date.now()
    });
  }

  // Payment Processing
  async sendPaymentRequest(paymentData) {
    return this.sendToQueue(this.queues.PAYMENT_PROCESSING, {
      ...paymentData,
      timestamp: Date.now()
    });
  }

  // Data Sync
  async sendDataSync(syncData) {
    return this.sendToQueue(this.queues.DATA_SYNC, {
      ...syncData,
      timestamp: Date.now()
    });
  }

  // Email Notifications
  async sendEmailNotification(emailData) {
    return this.sendToQueue(this.queues.EMAIL_NOTIFICATIONS, {
      ...emailData,
      timestamp: Date.now()
    });
  }

  // Health Check
  async healthCheck() {
    if (!this.isConnected || !this.channel) return false;
    try {
      await this.channel.checkQueue(this.queues.MATCH_UPDATES);
      return true;
    } catch (error) {
      console.error('RabbitMQ health check error:', error.message);
      return false;
    }
  }

  // Get queue info
  async getQueueInfo(queueName) {
    if (!this.isConnected || !this.channel) return null;
    try {
      return await this.channel.checkQueue(queueName);
    } catch (error) {
      console.error('RabbitMQ getQueueInfo error:', error.message);
      return null;
    }
  }
}

// Create singleton instance
const rabbitMQClient = new RabbitMQClient();

export default rabbitMQClient;
