'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { galleryImages } from "@/data/gallery";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function GallerySection({ language }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getLocalized = (item, field) => {
    const langKey = `${field}_${language}`;
    return item[langKey] || item[`${field}_en`] || '';
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    setSelectedImage(galleryImages[(currentIndex + 1) % galleryImages.length]);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setSelectedImage(galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length]);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'en' && "Photo Gallery"}
            {language === 'hi' && "फोटो गैलरी"}
            {language === 'mr' && "फोटो गॅलरी"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'en' && "Moments of joy, care, and community at Suryoday Vruddhashram"}
            {language === 'hi' && "सूर्योदय वृद्धाश्रम में आनंद, देखभाल और समुदाय के पल"}
            {language === 'mr' && "सूर्योदय वृद्धाश्रमात आनंद, सेवा आणि समाजाचे क्षण"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-8"></div>
        </motion.div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => {
                setSelectedImage(image);
                setCurrentIndex(index);
              }}
              className="relative h-48 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {image.image && image.image !== "/gallery/image1.jpg" ? (
                <img
                  src={image.image}
                  alt={getLocalized(image, 'title')}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                  <p className="text-center text-gray-600">
                    <div className="text-2xl mb-2">📷</div>
                    {language === 'en' && "Photo coming soon"}
                    {language === 'hi' && "फोटो जल्द आ रहा है"}
                    {language === 'mr' && "फोटो लवकरच येणार आहे"}
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white">
                  <p className="font-semibold text-sm">{getLocalized(image, 'title')}</p>
                  <p className="text-xs text-gray-300">{getLocalized(image, 'category')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative h-96 bg-gray-100 flex items-center justify-center">
                {selectedImage.image && selectedImage.image !== "/gallery/image1.jpg" ? (
                  <img src={selectedImage.image} alt={getLocalized(selectedImage, 'title')} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-2">📷</div>
                    <p className="text-gray-600">{language === 'en' && "Photo"} {language === 'hi' && "फोटो"} {language === 'mr' && "फोटो"}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getLocalized(selectedImage, 'title')}
                </h3>
                <p className="text-sm text-purple-600 font-semibold mb-3">
                  {getLocalized(selectedImage, 'category')}
                </p>
                <p className="text-gray-700 mb-6">
                  {getLocalized(selectedImage, 'description')}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4 bg-gray-100">
                <button
                  onClick={prevImage}
                  className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-gray-700 font-semibold">
                  {currentIndex + 1} / {galleryImages.length}
                </span>
                <button
                  onClick={nextImage}
                  className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
