'use client';
import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Award } from "lucide-react";

export default function AboutSection({ content }) {
  const stats = [
    { icon: Users, value: "500+", label: content.about.stat1 },
    { icon: Target, value: "50+", label: content.about.stat2 },
    { icon: Award, value: "5+", label: content.about.stat3 }
  ];
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.about.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-orange-500 mx-auto mb-8"></div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.about.description1}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.about.description2}
            </p>
            <div className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-xl border border-green-100">
              <p className="text-gray-800 font-medium italic">
                "{content.about.mission}"
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
