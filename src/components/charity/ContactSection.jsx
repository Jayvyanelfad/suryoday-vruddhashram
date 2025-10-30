'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export default function ContactSection({ content }) {
  const [phoneNumber, setPhoneNumber] = useState("+91 9604516653");

  useEffect(() => {
    // Load custom phone from admin dashboard
    const savedPhone = localStorage.getItem('contactPhone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      label: content.contact.email.label,
      value: "tejaswifoundation2013@gmail.com",
      href: "mailto:tejaswifoundation2013@gmail.com",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      label: content.contact.phone.label,
      value: phoneNumber,
      href: `tel:${phoneNumber}`,
      color: "text-green-500"
    },
    {
      icon: MapPin,
      label: content.contact.address.label,
      value: "Mahadeev Nagar, Dhayri, Pune 411041, India",
      href: "https://maps.app.goo.gl/M7rG6URQZTyffZbh9",
      color: "text-orange-500"
    }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(content.contact.whatsapp.message);
    const phoneDigits = phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneDigits}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.contact.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.contact.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-orange-500 mx-auto mt-8"></div>
        </motion.div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 ${info.color} bg-opacity-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{info.label}</p>
                    <p className="text-lg text-gray-900 font-semibold">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {content.contact.whatsapp.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {content.contact.whatsapp.description}
                </p>
                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {content.contact.whatsapp.button}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
