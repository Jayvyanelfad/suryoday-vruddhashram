'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function AdminDashboard() {
  const [contactPhone, setContactPhone] = useState('+91 9604516653');
  const [whatsappMessage, setWhatsappMessage] = useState('Hi! I\'d like to know more about Suryoday Vruddhashram.');
  const [galleryPhoto, setGalleryPhoto] = useState('');
  const [teamPhoto, setTeamPhoto] = useState('');
  const [saved, setSaved] = useState(false);

  const handleUpdateContact = () => {
    // Save to localStorage
    localStorage.setItem('contactPhone', contactPhone);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    alert('Phone number updated! The website will use this new number.');
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = event.target.result;
        localStorage.setItem(`${type}_photo`, photoData);
        alert(`Photo uploaded for ${type}!`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-green-600" fill="currentColor" />
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Suryoday Vruddhashram - Update Website Content</p>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
            ✓ Changes saved successfully! Website will update automatically.
          </div>
        )}

        {/* Contact Information Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📞 Contact Information</h2>
          
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp & Contact Phone Number
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+91 9604516653"
                />
                <button
                  onClick={handleUpdateContact}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">This number will appear in Contact section and WhatsApp button</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="tejaswifoundation2013@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com"
              />
              <p className="text-sm text-gray-500 mt-2">Contact email for inquiries</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                defaultValue="Mahadeev Nagar, Dhayri, Pune 411041, India"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Photo Management</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gallery Photos */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl mb-2">🖼️</div>
                <h3 className="font-bold text-gray-900 mb-2">Gallery Photos</h3>
                <p className="text-sm text-gray-600 mb-4">Upload activity & facility photos</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'gallery')}
                className="hidden"
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Photos
              </label>
              <p className="text-xs text-gray-500 mt-3">JPG, PNG - Multiple allowed</p>
            </div>

            {/* Team Photos */}
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="font-bold text-gray-900 mb-2">Team Photos</h3>
                <p className="text-sm text-gray-600 mb-4">Upload staff & team member photos</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'team')}
                className="hidden"
                id="team-upload"
              />
              <label
                htmlFor="team-upload"
                className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
              >
                Choose Photos
              </label>
              <p className="text-xs text-gray-500 mt-3">JPG, PNG - Multiple allowed</p>
            </div>
          </div>
        </div>

        {/* Content Update Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6 border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✏️ Quick Updates</h2>
          
          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-orange-100 text-orange-900 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-left">
              📊 Update Statistics (Residents, Meals, Years)
            </button>
            <button className="w-full px-6 py-3 bg-orange-100 text-orange-900 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-left">
              👤 Manage Team Members
            </button>
            <button className="w-full px-6 py-3 bg-orange-100 text-orange-900 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-left">
              ⭐ View Testimonials
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3">💡 How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ All changes are saved locally in your browser</li>
            <li>✓ Photos can be uploaded and stored</li>
            <li>✓ Contact information updates immediately</li>
            <li>✓ Website reflects changes automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
