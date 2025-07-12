import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Star, Package, ArrowUpDown, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { fadeIn, slideUp } from '../utils/motion';

const Dashboard = () => {
  const { user } = useAuth();
  const { items, swaps } = useItems();
  const [activeTab, setActiveTab] = useState('overview');

  const userItems = items.filter(item => item.userId === user?.id);
  const userSwaps = swaps.filter(swap => 
    swap.requesterId === user?.id || swap.ownerId === user?.id
  );
  const ongoingSwaps = userSwaps.filter(swap => swap.status === 'pending' || swap.status === 'accepted');
  const completedSwaps = userSwaps.filter(swap => swap.status === 'completed');

  const stats = [
    { label: 'Points Balance', value: user?.points || 0, icon: Star, color: 'text-yellow-600' },
    { label: 'Listed Items', value: userItems.length, icon: Package, color: 'text-blue-600' },
    { label: 'Active Swaps', value: ongoingSwaps.length, icon: ArrowUpDown, color: 'text-green-600' },
    { label: 'Completed Swaps', value: completedSwaps.length, icon: ArrowUpDown, color: 'text-purple-600' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'items', label: 'My Items' },
    { id: 'swaps', label: 'My Swaps' }
  ];

  return (
    <div className="min-h-screen bg-[#CAD2C5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeIn} className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-[#84A98C] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2F3E46]">Welcome back, {user?.name}!</h1>
                <p className="text-[#354F52]">Manage your items and track your swaps</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button as={Link} to="/add-item" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div {...slideUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#354F52]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#2F3E46]">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#52796F] text-[#52796F]'
                      : 'border-transparent text-[#354F52] hover:text-[#52796F] hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div {...fadeIn} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#2F3E46] mb-4">Recent Activity</h3>
                  {ongoingSwaps.length > 0 ? (
                    <div className="space-y-4">
                      {ongoingSwaps.slice(0, 3).map((swap) => (
                        <div key={swap.id} className="flex items-center justify-between p-4 bg-[#CAD2C5] rounded-lg">
                          <div>
                            <p className="font-medium text-[#2F3E46]">
                              Swap with {swap.requesterId === user?.id ? swap.ownerName : swap.requesterName}
                            </p>
                            <p className="text-sm text-[#354F52]">Status: {swap.status}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {swap.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#354F52]">No recent activity</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'items' && (
              <motion.div {...fadeIn}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#2F3E46]">My Listed Items</h3>
                  <Button as={Link} to="/add-item" size="sm">
                    Add New Item
                  </Button>
                </div>
                {userItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <Card key={item.id} item={item} showActions />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-[#84A98C] mx-auto mb-4" />
                    <p className="text-[#354F52] mb-4">You haven't listed any items yet</p>
                    <Button as={Link} to="/add-item">
                      List Your First Item
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'swaps' && (
              <motion.div {...fadeIn} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#2F3E46] mb-4">Ongoing Swaps</h3>
                  {ongoingSwaps.length > 0 ? (
                    <div className="space-y-4">
                      {ongoingSwaps.map((swap) => (
                        <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2F3E46]">
                                {swap.itemTitle}
                              </p>
                              <p className="text-sm text-[#354F52]">
                                With {swap.requesterId === user?.id ? swap.ownerName : swap.requesterName}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {swap.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#354F52]">No ongoing swaps</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#2F3E46] mb-4">Completed Swaps</h3>
                  {completedSwaps.length > 0 ? (
                    <div className="space-y-4">
                      {completedSwaps.map((swap) => (
                        <div key={swap.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2F3E46]">
                                {swap.itemTitle}
                              </p>
                              <p className="text-sm text-[#354F52]">
                                With {swap.requesterId === user?.id ? swap.ownerName : swap.requesterName}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#354F52]">No completed swaps yet</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;