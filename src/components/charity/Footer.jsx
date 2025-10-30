'use client';
import React from "react";
import { motion } from "framer-motion";
import { Heart, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer({ content }) {
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/hopecharityorg",
      color: "hover:text-blue-600 hover:bg-blue-50"
    },
    {
      icon: Instagram,
      href: "https://instagram.com/hopecharityorg",
      color: "hover:text-pink-600 hover:bg-pink-50"
    },
    {
      icon: Twitter,
      href: "https://twitter.com/hopecharityorg",
      color: "hover:text-blue-400 hover:bg-blue-50"
    },
    {
      icon: Youtube,
      href: "https://youtube.com/hopecharityorg",
      color: "hover:text-red-600 hover:bg-red-50"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{content.footer.orgName}</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {content.footer.tagline}
            </p>
          </div>
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border-t border-gray-800 pt-8 text-gray-400 text-sm"
          >
            <p>{content.footer.copyright}</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
