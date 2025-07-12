import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, MapPin, Calendar, Tag, User } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { fadeIn, slideUp } from '../utils/motion';

const ItemListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, requestSwap, redeemWithPoints } = useItems();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundItem = items.find(item => item.id === parseInt(id));
    setItem(foundItem);
  }, [id, items]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#CAD2C5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#354F52] text-lg mb-4">Item not found</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleSwapRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await requestSwap(item.id, swapMessage);
      setShowSwapModal(false);
      setSwapMessage('');
      alert('Swap request sent successfully!');
    } catch (error) {
      alert('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.points < item.pointsRequired) {
      alert('Insufficient points for redemption');
      return;
    }

    setLoading(true);
    try {
      await redeemWithPoints(item.id);
      setShowRedeemModal(false);
      alert('Item redeemed successfully!');
    } catch (error) {
      alert('Failed to redeem item');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?.id === item.userId;
  const canInteract = user && !isOwner && item.status === 'available';

  return (
    <div className="min-h-screen bg-[#CAD2C5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div {...fadeIn} className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[#52796F] hover:text-[#354F52]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-[#354F52]">/</span>
          <span className="text-[#354F52]">{item.category}</span>
          <span className="text-[#354F52]">/</span>
          <span className="text-[#2F3E46] font-medium">{item.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div {...slideUp} className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={item.images[currentImageIndex] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-[#52796F]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Item Details */}
          <motion.div {...slideUp} transition={{ delay: 0.1 }} className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#2F3E46] mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-[#354F52]">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{item.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Heart className="w-5 h-5 text-[#52796F]" />
                  </button>
                  <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Share2 className="w-5 h-5 text-[#52796F]" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'available' ? 'Available' : 
                   item.status === 'pending' ? 'Pending Swap' : 'Unavailable'}
                </span>
                <span className="flex items-center space-x-1 text-[#354F52]">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{item.pointsRequired} points</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-[#2F3E46] mb-3">Description</h3>
              <p className="text-[#354F52] leading-relaxed">{item.description}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-[#2F3E46] mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#354F52]">Size:</span>
                  <span className="ml-2 font-medium text-[#2F3E46]">{item.size}</span>
                </div>
                <div>
                  <span className="text-[#354F52]">Condition:</span>
                  <span className="ml-2 font-medium text-[#2F3E46]">{item.condition}</span>
                </div>
                <div>
                  <span className="text-[#354F52]">Type:</span>
                  <span className="ml-2 font-medium text-[#2F3E46]">{item.type}</span>
                </div>
                <div>
                  <span className="text-[#354F52]">Location:</span>
                  <span className="ml-2 font-medium text-[#2F3E46] flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location || 'Not specified'}
                  </span>
                </div>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-[#354F52] text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#CAD2C5] text-[#354F52] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-[#2F3E46] mb-3">Listed by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#84A98C] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#2F3E46]">{item.ownerName}</p>
                  <p className="text-sm text-[#354F52]">Member since {new Date(item.ownerJoinDate).getFullYear()}</p>
                </div>
              </div>
            </div>

            {canInteract && (
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowSwapModal(true)}
                  className="flex-1"
                >
                  Request Swap
                </Button>
                <Button
                  onClick={() => setShowRedeemModal(true)}
                  variant="outline"
                  className="flex-1"
                  disabled={user.points < item.pointsRequired}
                >
                  Redeem ({item.pointsRequired} points)
                </Button>
              </div>
            )}

            {!user && (
              <div className="bg-[#84A98C] bg-opacity-10 rounded-lg p-4 text-center">
                <p className="text-[#354F52] mb-3">Sign in to interact with this item</p>
                <Button as="a" href="/login">Sign In</Button>
              </div>
            )}

            {isOwner && (
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-blue-800">This is your item</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Swap Request Modal */}
      <Modal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        title="Request Swap"
      >
        <div className="space-y-4">
          <p className="text-[#354F52]">
            Send a swap request for <strong>{item.title}</strong>
          </p>
          <textarea
            value={swapMessage}
            onChange={(e) => setSwapMessage(e.target.value)}
            placeholder="Add a message to your swap request (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent"
            rows={4}
          />
          <div className="flex space-x-3">
            <Button
              onClick={handleSwapRequest}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
            <Button
              onClick={() => setShowSwapModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Redeem Modal */}
      <Modal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        title="Redeem with Points"
      >
        <div className="space-y-4">
          <p className="text-[#354F52]">
            Redeem <strong>{item.title}</strong> for {item.pointsRequired} points?
          </p>
          <div className="bg-[#CAD2C5] rounded-lg p-4">
            <p className="text-[#354F52]">
              Your current balance: <strong>{user?.points || 0} points</strong>
            </p>
            <p className="text-[#354F52]">
              After redemption: <strong>{(user?.points || 0) - item.pointsRequired} points</strong>
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleRedeem}
              disabled={loading || (user?.points || 0) < item.pointsRequired}
              className="flex-1"
            >
              {loading ? 'Redeeming...' : 'Confirm Redemption'}
            </Button>
            <Button
              onClick={() => setShowRedeemModal(false)}
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

export default ItemListing;