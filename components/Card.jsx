import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Heart, Share2, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Card = ({ item, featured = false, showActions = false }) => {
  const { user } = useAuth();
  const isOwner = user?.id === item.userId;

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle like functionality
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle share functionality
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle edit functionality
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle delete functionality
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${
        featured ? 'ring-2 ring-[#84A98C]' : ''
      }`}
    >
      <Link to={`/item/${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'available' ? 'bg-green-100 text-green-800' :
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {item.status === 'available' ? 'Available' : 
               item.status === 'pending' ? 'Pending' : 'Unavailable'}
            </span>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#84A98C] text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleLike}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <Heart className="w-4 h-4 text-[#52796F]" />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#52796F]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-[#2F3E46] text-lg truncate flex-1 mr-2">
              {item.title}
            </h3>
            <div className="flex items-center space-x-1 text-[#354F52] flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{item.pointsRequired}</span>
            </div>
          </div>

          <p className="text-[#354F52] text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between text-xs text-[#354F52] mb-3">
            <div className="flex items-center space-x-4">
              <span className="capitalize font-medium">{item.category}</span>
              <span>Size {item.size}</span>
              <span>{item.condition}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#354F52]">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{item.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#CAD2C5] text-[#354F52] text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Owner Actions */}
          {showActions && isOwner && (
            <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                size="sm"
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;