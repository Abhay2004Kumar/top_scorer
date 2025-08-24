import React, { useState, useEffect } from 'react';
import { api } from '../../util/axiosUtil';
import { FaUsers, FaBlog, FaCreditCard, FaServer, FaDatabase, FaBolt } from 'react-icons/fa';
import { GiTennisRacket, GiCricketBat, GiSoccerKick } from 'react-icons/gi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: {},
    blogs: {},
    payments: {},
    system: {}
  });
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch health status
      const healthResponse = await api.healthCheck();
      setHealthStatus(healthResponse.data.services);
      
      // Fetch statistics
      const [blogStats, paymentStats] = await Promise.all([
        api.getBlogStats().catch(() => ({ data: { stats: {} } })),
        api.getPaymentStats().catch(() => ({ data: { stats: {} } }))
      ]);
      
      setStats({
        blogs: blogStats.data.stats || {},
        payments: paymentStats.data.stats || {},
        users: {},
        system: healthResponse.data.services || {}
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusColor = (status) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getHealthStatusIcon = (status) => {
    return status ? '🟢' : '🔴';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Top Scorer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time statistics and system health monitoring
          </p>
        </div>

        {/* System Health Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Health Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaDatabase className="text-2xl text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Database</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MongoDB Connection</p>
                  </div>
                </div>
                <div className={`text-2xl ${getHealthStatusColor(healthStatus.database)}`}>
                  {getHealthStatusIcon(healthStatus.database)}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBolt className="text-2xl text-red-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Redis Cache</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Session & Data Cache</p>
                  </div>
                </div>
                <div className={`text-2xl ${getHealthStatusColor(healthStatus.redis)}`}>
                  {getHealthStatusIcon(healthStatus.redis)}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaServer className="text-2xl text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Message Queue</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">RabbitMQ Service</p>
                  </div>
                </div>
                <div className={`text-2xl ${getHealthStatusColor(healthStatus.rabbitmq)}`}>
                  {getHealthStatusIcon(healthStatus.rabbitmq)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Blog Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <FaBlog className="text-3xl text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blogs</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.blogs.totalCreated || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.blogs.totalViews || 0} views
                </p>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.users.totalRegistrations || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.users.activeSessions || 0} active
                </p>
              </div>
            </div>
          </div>

          {/* Payment Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <FaCreditCard className="text-3xl text-purple-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payments</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.payments.successfulPayments || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ₹{stats.payments.totalAmount || 0} total
                </p>
              </div>
            </div>
          </div>

          {/* Cache Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <FaBolt className="text-3xl text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cache Hit</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.blogs.cacheHits || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.blogs.cacheMisses || 0} misses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sports Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sports Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <GiCricketBat className="text-3xl text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cricket</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Live matches & updates</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <GiSoccerKick className="text-3xl text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Football</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Match scores & stats</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <GiTennisRacket className="text-3xl text-purple-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Tennis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Singles & doubles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cache Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
                  <span className="font-semibold text-green-600">
                    {stats.blogs.cacheHits && stats.blogs.cacheMisses 
                      ? Math.round((stats.blogs.cacheHits / (stats.blogs.cacheHits + stats.blogs.cacheMisses)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Requests</span>
                  <span className="font-semibold text-blue-600">
                    {(stats.blogs.cacheHits || 0) + (stats.blogs.cacheMisses || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">All Services</span>
                  <span className={`font-semibold ${Object.values(healthStatus).every(Boolean) ? 'text-green-600' : 'text-red-600'}`}>
                    {Object.values(healthStatus).every(Boolean) ? 'Healthy' : 'Issues Detected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
