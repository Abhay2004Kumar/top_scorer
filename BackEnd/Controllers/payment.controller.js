import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";
import redisClient from "../utils/redis.js";
import rabbitMQClient from "../utils/rabbitmq.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "inr", paymentMethodType = "card" } = req.body;

    if (!amount) {
      throw new ApiError(400, "Amount is required");
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency,
      payment_method_types: [paymentMethodType],
      metadata: {
        userId: req.user?._id,
        purpose: req.body.purpose || "donation"
      }
    });

    // Send payment request to RabbitMQ for processing
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendPaymentRequest({
        paymentIntentId: paymentIntent.id,
        userId: req.user?._id,
        amount: amount,
        currency: currency,
        purpose: req.body.purpose || "donation",
        status: "pending"
      });
    }

    // Increment payment statistics
    await redisClient.incrementStat('payments', 'totalRequests');
    await redisClient.incrementStat('payments', 'pendingPayments');

    return res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    throw new ApiError(500, "Error creating payment intent");
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      throw new ApiError(400, "Payment intent ID is required");
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update payment statistics
      await redisClient.incrementStat('payments', 'successfulPayments');
      await redisClient.incrementStat('payments', 'pendingPayments', -1);
      await redisClient.incrementStat('payments', 'totalAmount', paymentIntent.amount / 100);

      // Send success notification via RabbitMQ
      if (rabbitMQClient.isConnected) {
        await rabbitMQClient.sendNotification({
          type: 'payment_success',
          userId: paymentIntent.metadata.userId,
          paymentIntentId: paymentIntentId,
          amount: paymentIntent.amount / 100,
          message: `Payment of ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()} completed successfully.`,
          priority: 'high'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment confirmed successfully",
        data: {
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        }
      });
    } else {
      throw new ApiError(400, `Payment status: ${paymentIntent.status}`);
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    throw new ApiError(500, "Error confirming payment");
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get payment intents for user
    const paymentIntents = await stripe.paymentIntents.list({
      limit: limit,
      metadata: { userId: userId }
    });

    // Format payment history
    const paymentHistory = paymentIntents.data.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      created: new Date(payment.created * 1000),
      purpose: payment.metadata.purpose
    }));

    return res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: paymentHistory
    });
  } catch (error) {
    console.error("Payment history error:", error);
    throw new ApiError(500, "Error retrieving payment history");
  }
};

const createSubscription = async (req, res) => {
  try {
    const { priceId, customerId } = req.body;

    if (!priceId) {
      throw new ApiError(400, "Price ID is required");
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: req.user?._id
      }
    });

    // Send subscription request to RabbitMQ
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendPaymentRequest({
        subscriptionId: subscription.id,
        userId: req.user?._id,
        priceId: priceId,
        status: "pending",
        type: "subscription"
      });
    }

    // Increment subscription statistics
    await redisClient.incrementStat('subscriptions', 'totalRequests');

    return res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    throw new ApiError(500, "Error creating subscription");
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      throw new ApiError(400, "Subscription ID is required");
    }

    // Cancel subscription
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // Send cancellation notification via RabbitMQ
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendNotification({
        type: 'subscription_cancelled',
        userId: req.user?._id,
        subscriptionId: subscriptionId,
        message: "Your subscription has been cancelled successfully.",
        priority: 'medium'
      });
    }

    // Update subscription statistics
    await redisClient.incrementStat('subscriptions', 'cancelledSubscriptions');

    return res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: {
        status: subscription.status,
        cancelledAt: new Date(subscription.canceled_at * 1000)
      }
    });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    throw new ApiError(500, "Error cancelling subscription");
  }
};

const getPaymentStats = async (req, res) => {
  try {
    // Get payment statistics from Redis
    const paymentStats = await redisClient.getStats('payments');
    const subscriptionStats = await redisClient.getStats('subscriptions');

    return res.status(200).json({
      success: true,
      message: "Payment statistics retrieved successfully",
      data: {
        payments: paymentStats,
        subscriptions: subscriptionStats
      }
    });
  } catch (error) {
    console.error("Payment stats error:", error);
    throw new ApiError(500, "Error retrieving payment statistics");
  }
};

export {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  createSubscription,
  cancelSubscription,
  getPaymentStats
};
