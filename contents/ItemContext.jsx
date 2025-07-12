import React, { createContext, useContext, useState, useEffect } from 'react';

const ItemContext = createContext();

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock items data
  const mockItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      description: 'Classic blue denim jacket in excellent condition. Perfect for casual outings.',
      category: 'outerwear',
      size: 'M',
      condition: 'Good',
      type: 'both',
      pointsRequired: 25,
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
      userId: 1,
      ownerName: 'John Doe',
      ownerJoinDate: '2023-01-15',
      status: 'available',
      featured: true,
      tags: ['vintage', 'casual', 'denim'],
      location: 'New York, NY',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Floral Summer Dress',
      description: 'Beautiful floral print dress perfect for summer occasions.',
      category: 'dresses',
      size: 'S',
      condition: 'Like New',
      type: 'swap',
      pointsRequired: 20,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
      userId: 2,
      ownerName: 'Jane Smith',
      ownerJoinDate: '2023-02-20',
      status: 'available',
      featured: true,
      tags: ['floral', 'summer', 'casual'],
      location: 'Los Angeles, CA',
      createdAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 3,
      title: 'Black Leather Boots',
      description: 'Stylish black leather ankle boots, barely worn.',
      category: 'shoes',
      size: '8',
      condition: 'Like New',
      type: 'points',
      pointsRequired: 30,
      images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'],
      userId: 1,
      ownerName: 'John Doe',
      ownerJoinDate: '2023-01-15',
      status: 'available',
      featured: false,
      tags: ['leather', 'boots', 'formal'],
      location: 'Chicago, IL',
      createdAt: '2024-01-25T09:15:00Z'
    },
    {
      id: 4,
      title: 'Cozy Knit Sweater',
      description: 'Warm and comfortable knit sweater in cream color.',
      category: 'tops',
      size: 'L',
      condition: 'Good',
      type: 'both',
      pointsRequired: 18,
      images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'],
      userId: 3,
      ownerName: 'Mike Johnson',
      ownerJoinDate: '2023-03-10',
      status: 'available',
      featured: true,
      tags: ['knit', 'cozy', 'winter'],
      location: 'Seattle, WA',
      createdAt: '2024-02-01T16:45:00Z'
    }
  ];

  useEffect(() => {
    // Load items from localStorage or use mock data
    const storedItems = localStorage.getItem('rewear_items');
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        setItems(mockItems);
        localStorage.setItem('rewear_items', JSON.stringify(mockItems));
      }
    } else {
      setItems(mockItems);
      localStorage.setItem('rewear_items', JSON.stringify(mockItems));
    }

    // Load swaps
    const storedSwaps = localStorage.getItem('rewear_swaps');
    if (storedSwaps) {
      try {
        setSwaps(JSON.parse(storedSwaps));
      } catch (error) {
        setSwaps([]);
      }
    }
  }, []);

  const addItem = async (itemData) => {
    try {
      setLoading(true);
      const newItem = {
        ...itemData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      localStorage.setItem('rewear_items', JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, updates) => {
    try {
      setLoading(true);
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      setItems(updatedItems);
      localStorage.setItem('rewear_items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem('rewear_items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestSwap = async (itemId, message) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      const newSwap = {
        id: Date.now(),
        itemId,
        itemTitle: item.title,
        requesterId: 1, // Mock current user ID
        requesterName: 'Current User',
        ownerId: item.userId,
        ownerName: item.ownerName,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const updatedSwaps = [...swaps, newSwap];
      setSwaps(updatedSwaps);
      localStorage.setItem('rewear_swaps', JSON.stringify(updatedSwaps));
      
      // Update item status
      await updateItem(itemId, { status: 'pending' });
      
      return newSwap;
    } catch (error) {
      console.error('Error requesting swap:', error);
      throw error;
    }
  };

  const redeemWithPoints = async (itemId) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Update item status
      await updateItem(itemId, { status: 'redeemed' });
      
      return true;
    } catch (error) {
      console.error('Error redeeming item:', error);
      throw error;
    }
  };

  const value = {
    items,
    swaps,
    loading,
    addItem,
    updateItem,
    deleteItem,
    requestSwap,
    redeemWithPoints
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};