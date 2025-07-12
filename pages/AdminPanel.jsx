import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ArrowUpDown, AlertTriangle, Check, X, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { fadeIn, slideUp } from '../utils/motion';

const AdminPanel = () => {
  const { user } = useAuth();
  const { items, swaps, updateItem, deleteItem } = useItems();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#CAD2C5] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2F3E46] mb-2">Access Denied</h2>
          <p className="text-[#354F52]">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Items', value: items.length, icon: Package, color: 'text-blue-600' },
    { label: 'Active Swaps', value: swaps.filter(s => s.status === 'pending').length, icon: ArrowUpDown, color: 'text-green-600' },
    { label: 'Total Users', value: 25, icon: Users, color: 'text-purple-600' },
    { label: 'Pending Reviews', value: items.filter(i => i.status === 'pending_review').length, icon: AlertTriangle, color: 'text-orange-600' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'items', label: 'Item Management' },
    { id: 'swaps', label: 'Swap Management' },
    { id: 'users', label: 'User Management' }
  ];

  const handleApproveItem = async (itemId) => {
    try {
      await updateItem(itemId, { status: 'available' });
    } catch (error) {
      alert('Failed to approve item');
    }
  };

  const handleRejectItem = async (itemId) => {
    try {
      await updateItem(itemId, { status: 'rejected' });
    } catch (error) {
      alert('Failed to reject item');
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const viewItemDetails = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  return (
    <div className="min-h-screen bg-[#CAD2C5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeIn} className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-[#2F3E46] mb-2">Admin Panel</h1>
          <p className="text-[#354F52]">Manage items, users, and platform operations</p>
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
              <motion.div {...fadeIn} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2F3E46] mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-[#CAD2C5] rounded-lg">
                        <div>
                          <p className="font-medium text-[#2F3E46]">{item.title}</p>
                          <p className="text-sm text-[#354F52]">Listed by {item.ownerName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'items' && (
              <motion.div {...fadeIn}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#2F3E46]">Item Management</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={item.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100'}
                                alt={item.title}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-[#2F3E46]">{item.title}</div>
                                <div className="text-sm text-[#354F52]">{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#354F52]">
                            {item.ownerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#354F52]">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => viewItemDetails(item)}
                              className="text-[#52796F] hover:text-[#354F52]"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {item.status === 'pending_review' && (
                              <>
                                <button
                                  onClick={() => handleApproveItem(item.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectItem(item.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'swaps' && (
              <motion.div {...fadeIn}>
                <h3 className="text-lg font-semibold text-[#2F3E46] mb-6">Swap Management</h3>
                <div className="space-y-4">
                  {swaps.map((swap) => (
                    <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#2F3E46]">{swap.itemTitle}</p>
                          <p className="text-sm text-[#354F52]">
                            {swap.requesterName} ↔ {swap.ownerName}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div {...fadeIn}>
                <h3 className="text-lg font-semibold text-[#2F3E46] mb-6">User Management</h3>
                <p className="text-[#354F52]">User management features coming soon...</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title="Item Details"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <img
              src={selectedItem.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold text-[#2F3E46] text-lg">{selectedItem.title}</h4>
              <p className="text-[#354F52] mt-2">{selectedItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-[#354F52]">Category:</span>
                <span className="ml-2 text-[#2F3E46]">{selectedItem.category}</span>
              </div>
              <div>
                <span className="font-medium text-[#354F52]">Size:</span>
                <span className="ml-2 text-[#2F3E46]">{selectedItem.size}</span>
              </div>
              <div>
                <span className="font-medium text-[#354F52]">Condition:</span>
                <span className="ml-2 text-[#2F3E46]">{selectedItem.condition}</span>
              </div>
              <div>
                <span className="font-medium text-[#354F52]">Points:</span>
                <span className="ml-2 text-[#2F3E46]">{selectedItem.pointsRequired}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-[#354F52]">
            Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={handleDeleteItem}
              variant="danger"
              className="flex-1"
            >
              Delete Item
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPanel;