'use client';
import React from "react";
import { motion } from "framer-motion";
import { statistics } from "@/data/statistics";

export default function StatsSection({ language }) {
  const getLocalized = (item, field) => {
    const langKey = `${field}_${language}`;
    return item[langKey] || item[`${field}_en`] || '';
  };

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'en' && "Our Impact"}
            {language === 'hi' && "हमारा प्रभाव"}
            {language === 'mr' && "आमचा प्रभाव"}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {language === 'en' && "Real numbers showing our commitment to elderly care"}
            {language === 'hi' && "वृद्ध देखभाल के प्रति हमारी प्रतिबद्धता दर्शाने वाली वास्तविक संख्याएं"}
            {language === 'mr' && "वृद्ध सेवेसाठी आमच्या वचनबद्धतेचे वास्तविक आंकडे"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">
                {getLocalized(stat, 'label')}
              </h3>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {getLocalized(stat, 'description')}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 max-w-2xl mx-auto"
        >
          <p className="text-white">
            💡 {language === 'en' && "Edit the numbers above with real statistics from Suryoday Vruddhashram"}
            {language === 'hi' && "सूर्योदय वृद्धाश्रम से वास्तविक आंकड़ों के साथ ऊपर दी गई संख्याओं को संपादित करें"}
            {language === 'mr' && "सूर्योदय वृद्धाश्रममधून वास्तविक आंकड्यांसह वरील संख्या संपादित करा"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
