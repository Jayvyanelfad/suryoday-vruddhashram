'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Need } from "@/entities/Need";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function NeedsSection({ content, language }) {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNeeds();
  }, []);

  const loadNeeds = async () => {
    try {
      const data = await Need.filter({ is_active: true }, '-priority', 10);
      setNeeds(data);
    } catch (error) {
      console.error('Error loading needs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getLocalizedContent = (need, field) => {
    const langKey = `${field}_${language}`;
    return need[langKey] || need[`${field}_en`] || '';
  };

  return (
    <section id="needs" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.needs.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.needs.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-orange-500 mx-auto mt-8"></div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-40"></div>
            ))}
          </div>
        ) : needs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {needs.map((need, index) => {
              const PriorityIcon = getPriorityIcon(need.priority);
              return (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-2 rounded-lg border ${getPriorityColor(need.priority)}`}>
                      <PriorityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {getLocalizedContent(need, 'title')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {getLocalizedContent(need, 'description')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {content.needs.empty.title}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.needs.empty.message}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
