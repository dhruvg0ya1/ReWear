import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shirt, Users, Recycle } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import Button from '../components/Button';
import Card from '../components/Card';
import SearchFilter from '../components/SearchFilter';
import { fadeIn, slideUp } from '../utils/motion';

const Landing = () => {
  const { items } = useItems();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  const featuredItems = items.filter(item => item.featured).slice(0, 4);
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'];

  useEffect(() => {
    setFilteredItems(items.slice(0, 8));
  }, [items]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleSearch = (searchTerm, category, sortBy) => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredItems(filtered.slice(0, 8));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#84A98C] to-[#52796F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sustainable Fashion
              <span className="block text-[#CAD2C5]">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join our community to exchange, swap, and give new life to pre-loved clothing. 
              Reduce waste, save money, and discover unique pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as={Link} to="/register" size="lg" variant="secondary">
                Start Swapping
              </Button>
              <Button as={Link} to="#browse" size="lg" variant="outline">
                Browse Items
              </Button>
              <Button as={Link} to="/add-item" size="lg" variant="outline">
                List an Item
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      {featuredItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 {...slideUp} className="text-3xl font-bold text-[#2F3E46] text-center mb-12">
              Featured Items
            </motion.h2>
            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredItems.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0">
                      <Card item={item} featured />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-[#52796F]" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="w-6 h-6 text-[#52796F]" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-[#CAD2C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...slideUp} className="text-3xl font-bold text-[#2F3E46] text-center mb-12">
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                {...slideUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleSearch('', category.toLowerCase(), '')}
              >
                <div className="w-12 h-12 bg-[#84A98C] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-[#52796F] transition-colors">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#354F52]">{category}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Browse Section */}
      <section id="browse" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...slideUp} className="text-3xl font-bold text-[#2F3E46] text-center mb-12">
            Browse Items
          </motion.h2>
          
          <SearchFilter onSearch={handleSearch} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                {...slideUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card item={item} />
              </motion.div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#354F52] text-lg">No items found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#CAD2C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...slideUp} className="text-3xl font-bold text-[#2F3E46] text-center mb-12">
            Why Choose ReWear?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div {...slideUp} className="text-center">
              <div className="w-16 h-16 bg-[#84A98C] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F3E46] mb-4">Sustainable</h3>
              <p className="text-[#354F52]">Reduce textile waste and promote circular fashion by giving clothes a second life.</p>
            </motion.div>
            <motion.div {...slideUp} transition={{ delay: 0.1 }} className="text-center">
              <div className="w-16 h-16 bg-[#84A98C] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F3E46] mb-4">Community</h3>
              <p className="text-[#354F52]">Connect with like-minded individuals who share your passion for sustainable fashion.</p>
            </motion.div>
            <motion.div {...slideUp} transition={{ delay: 0.2 }} className="text-center">
              <div className="w-16 h-16 bg-[#84A98C] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shirt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F3E46] mb-4">Unique Finds</h3>
              <p className="text-[#354F52]">Discover one-of-a-kind pieces and vintage treasures you won't find anywhere else.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;