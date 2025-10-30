'use client';
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HandHelping, Heart, Share2 } from "lucide-react";

export default function HelpSection({ content }) {
  const helpOptions = [
    {
      icon: HandHelping,
      title: content.help.volunteer.title,
      description: content.help.volunteer.description,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      icon: Heart,
      title: content.help.donate.title,
      description: content.help.donate.description,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    },
    {
      icon: Share2,
      title: content.help.share.title,
      description: content.help.share.description,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    }
  ];

  return (
    <section id="help" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.help.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.help.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-orange-500 mx-auto mt-8"></div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {helpOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {option.title}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                {option.description}
              </p>
              <Button 
                className={`w-full mt-auto bg-gradient-to-r ${option.color} ${option.hoverColor} text-white font-semibold py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
                {option.title}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
