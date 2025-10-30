'use client';
import React from "react";
import { motion } from "framer-motion";
import { team } from "@/data/team";
import { Users, Award, Heart } from "lucide-react";

export default function TeamSection({ language }) {
  const getLocalized = (item, field) => {
    const langKey = `${field}_${language}`;
    return item[langKey] || item[`${field}_en`] || '';
  };

  const roleIcons = {
    "Medical Director": Award,
    "Senior Caregiver": Heart,
    "Healthcare Professional": Users,
    "चिकित्सा निदेशक": Award,
    "वरिष्ठ देखभालकर्ता": Heart,
    "वैद्यकीय संचालक": Award,
  };

  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'en' && "Our Dedicated Team"}
            {language === 'hi' && "हमारी समर्पित टीम"}
            {language === 'mr' && "आमची समर्पित टीम"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'en' && "Meet the compassionate professionals caring for our residents"}
            {language === 'hi' && "हमारे निवासियों की देखभाल करने वाले पेशेवरों से मिलें"}
            {language === 'mr' && "आमच्या रहिवाश्यांची सेवा करणाऱ्या व्यावसायिकांना भेटा"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => {
            const RoleIcon = roleIcons[getLocalized(member, 'role')] || Users;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Photo Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
                  {member.photo && member.photo !== "/team/doctor1.jpg" ? (
                    <img src={member.photo} alt={getLocalized(member, 'name')} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Users className="w-16 h-16 text-gray-300 mx-auto" />
                      <p className="text-sm text-gray-400 mt-2">Photo coming soon</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <RoleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-semibold text-green-600 uppercase">
                      {getLocalized(member, 'specialty')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {getLocalized(member, 'name')}
                  </h3>
                  
                  <p className="text-sm text-green-600 font-semibold mb-3">
                    {getLocalized(member, 'role')}
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>{language === 'en' && "Experience:"}{language === 'hi' && "अनुभव:"}{language === 'mr' && "अनुभव:"}</strong> {getLocalized(member, 'experience')}
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getLocalized(member, 'bio')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-blue-50 rounded-xl p-6 text-center max-w-2xl mx-auto"
        >
          <p className="text-gray-700">
            {language === 'en' && "💡 Note: Staff details can be updated with real photos and information from Suryoday Vruddhashram"}
            {language === 'hi' && "💡 नोट: कर्मचारी विवरण को वास्तविक फोटो और जानकारी के साथ अपडेट किया जा सकता है"}
            {language === 'mr' && "💡 नोट: कर्मचारी तपशील वास्तविक फोटो आणि माहितीसह अपडेट केले जाऊ शकतात"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
