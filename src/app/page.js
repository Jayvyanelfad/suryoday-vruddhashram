'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ChevronRight, CircleHelp, Heart, Mail, MapPin, Menu, Share2, Sparkles, Users, X } from 'lucide-react';
import LanguageSwitcher from '@/components/charity/LanguageSwitcher';
import { getSavedLanguage, saveLanguage } from '@/lib/language-preference';
import { stockImages } from '@/lib/stock-photography';

const translations = {
  en: {
    stockNote: 'Representative stock photography — pictured people are not Suryoday residents or staff.',
    nav: { about: 'About', care: 'Care', needs: 'Needs', gallery: 'Gallery', contact: 'Contact', support: 'Support' },
    quickAction: { eyebrow: 'A personal conversation', title: 'Support the mission', body: 'Ask the team about current needs, volunteering, or arranging a visit.', volunteer: 'Volunteer', share: 'Share' },
    hero: {
      eyebrow: 'Elder care rooted in dignity · Pune, India',
      title: 'Every season of life deserves to feel like belonging.',
      description: 'A warm community, thoughtful everyday support, and the reassurance of being treated with dignity.',
      primary: 'Support our work',
      secondary: 'Discover our story',
    },
    about: {
      title: 'A safe, heartfelt home for older adults',
      text: 'Rooted in the values of compassion and community, Suryoday Vruddhashram helps seniors live with comfort, routine, and belonging. Our team supports daily wellness, companionship, and respectful care for each resident.',
      mission: 'To support elders with respectful care, safety, nourishment, and a warm community where they can live with dignity.',
    },
    care: {
      title: 'What care looks like here',
      items: [
        'Daily personal care with empathy and respect',
        'Nutritious meals, hydration, and medication support',
        'Routine wellbeing check-ins and a calm environment',
        'Social connection, community activities, and companionship',
      ],
    },
    needs: {
      title: 'Current priorities',
      subtitle: 'These practical needs help us create a comfortable and steady daily life for residents.',
    },
    impact: {
      title: 'Support that brings comfort and consistency',
      stats: [
        { value: 'Care', label: 'Personal care and support' },
        { value: 'Meals', label: 'Nourishment' },
        { value: 'Community', label: 'Companionship' },
      ],
    },
    help: {
      title: 'Ways to help',
      donate: 'Donate',
      volunteer: 'Volunteer',
      share: 'Share',
      descriptions: [
        'Ask the organization directly about its current, verified needs and ways to contribute.',
        'Start a conversation with the team about visiting or volunteering.',
        'Share the mission with your family and community.',
      ],
    },
    team: {
      title: 'Guiding care with compassion',
      items: [
        { name: 'Organization leadership', role: 'Care coordination', description: 'Coordinates resident support and community partnerships.' },
        { name: 'Care Team', role: 'Resident support', description: 'Provides daily assistance, safety, and respectful personal care.' },
        { name: 'Wellbeing Team', role: 'Health & nutrition', description: 'Supports routines, nourishment, and wellness for every resident.' },
      ],
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        { q: 'Who does Suryoday Vruddhashram support?', a: 'It supports older adults who need companionship, daily care, and a safe, respectful place to live.' },
        { q: 'Can I visit or arrange a conversation?', a: 'Yes. Contact the organization directly using the details below to ask questions or arrange a visit.' },
        { q: 'How can I support the home?', a: 'You can donate, volunteer, or share information with friends and family who may want to help.' },
      ],
    },
    contact: {
      title: 'Reach out to us',
      email: 'Email',
      phone: 'Call',
      address: 'Visit',
      whatsapp: 'WhatsApp',
    },
    footer: 'Suryoday Vruddhashram · Care rooted in dignity and community.',
  },
  hi: {
    stockNote: 'प्रतिनिधि स्टॉक फ़ोटोग्राफ़ी — चित्रित लोग सूर्योदय के निवासी या कर्मचारी नहीं हैं।',
    nav: { about: 'हमारे बारे में', care: 'देखभाल', needs: 'ज़रूरतें', gallery: 'गैलरी', contact: 'संपर्क', support: 'सहयोग करें' },
    quickAction: { eyebrow: 'सीधी बातचीत', title: 'इस उद्देश्य का साथ दें', body: 'वर्तमान ज़रूरतों, स्वयंसेवा या मुलाक़ात के लिए टीम से पूछें।', volunteer: 'स्वयंसेवा', share: 'साझा करें' },
    hero: {
      eyebrow: 'गरिमा से जुड़ी वृद्ध देखभाल · पुणे, भारत',
      title: 'जीवन के हर पड़ाव में अपनापन होना चाहिए।',
      description: 'एक स्नेही समुदाय, रोज़मर्रा का विचारपूर्ण सहयोग और सम्मान के साथ जीने का भरोसा।',
      primary: 'हमारा सहयोग करें',
      secondary: 'हमारी कहानी जानें',
    },
    about: { title: 'बुजुर्गों के लिए सुरक्षित, स्नेही घर', text: 'करुणा और समुदाय के मूल्यों पर आधारित सूर्योदय वृद्धाश्रम वरिष्ठ नागरिकों को आराम, दिनचर्या और अपनापन देता है। हमारी टीम हर निवासी को दैनिक कल्याण, साथ और सम्मानजनक देखभाल प्रदान करती है।', mission: 'बुजुर्गों को सम्मानपूर्ण देखभाल, सुरक्षा, पोषण और ऐसा स्नेही समुदाय देना जहाँ वे गरिमा के साथ रह सकें।' },
    care: { title: 'यहाँ देखभाल कैसी होती है', items: ['दैनिक व्यक्तिगत देखभाल, सहानुभूति और सम्मान के साथ', 'पौष्टिक भोजन, जलयोजन और दवा सहायता', 'नियमित स्वास्थ्य जाँच और शांत वातावरण', 'सामाजिक जुड़ाव, गतिविधियाँ और साथ'] },
    needs: { title: 'वर्तमान प्राथमिकताएँ', subtitle: 'इन आवश्यकताओं से हम निवासियों के लिए आरामदायक और स्थिर दिनचर्या बनाते हैं।' },
    impact: { title: 'सहयोग जो आराम और स्थिरता देता है', stats: [{ value: 'देखभाल', label: 'व्यक्तिगत देखभाल और सहयोग' }, { value: 'भोजन', label: 'पोषण' }, { value: 'समुदाय', label: 'साथ और जुड़ाव' }] },
    help: {
      title: 'मदद करने के तरीके',
      donate: 'दान करें',
      volunteer: 'स्वयंसेवक',
      share: 'साझा करें',
      descriptions: ['वर्तमान, सत्यापित ज़रूरतों और योगदान के तरीकों के बारे में संस्था से सीधे पूछें।', 'मुलाक़ात या स्वयंसेवा के बारे में टीम से बात करें।', 'अपने परिवार और समुदाय के साथ यह उद्देश्य साझा करें।'],
    },
    team: { title: 'करुणा से चलती सेवा', items: [{ name: 'संस्था का नेतृत्व', role: 'देखभाल समन्वय', description: 'निवासियों की सहायता और सामुदायिक सहयोग का समन्वय करता है।' }, { name: 'देखभाल टीम', role: 'निवासी सहयोग', description: 'दैनिक सहायता, सुरक्षा और सम्मानपूर्ण व्यक्तिगत देखभाल प्रदान करती है।' }, { name: 'कल्याण टीम', role: 'स्वास्थ्य एवं पोषण', description: 'हर निवासी के लिए दिनचर्या, पोषण और स्वास्थ्य का समर्थन करती है।' }] },
    faq: { title: 'अक्सर पूछे जाने वाले प्रश्न', items: [{ q: 'सूर्योदय वृद्धाश्रम किसे सहयोग देता है?', a: 'यह उन बुजुर्गों को संभालता है जिन्हें परिवार की तरह सहारा, दैनिक देखभाल और सुरक्षित, सम्मानपूर्ण जीवन की ज़रूरत होती है।' }, { q: 'क्या मैं मिल सकता हूँ या बातचीत कर सकता हूँ?', a: 'हाँ, नीचे दिए गए संपर्क विवरण से बात कर सकते हैं या मुलाक़ात की व्यवस्था कर सकते हैं।' }, { q: 'मैं कैसे सहायता कर सकता हूँ?', a: 'आप दान, स्वयंसेवा या अपने परिवार/दोस्तों के साथ जानकारी साझा करके मदद कर सकते हैं।' }] },
    contact: { title: 'संपर्क करें', email: 'ईमेल', phone: 'कॉल', address: 'मिलें', whatsapp: 'व्हाट्सऐप' },
    footer: 'सूर्योदय वृद्धाश्रम · गरिमा और समुदाय से जुड़ी देखभाल।',
  },
  mr: {
    stockNote: 'प्रतिनिधिक स्टॉक छायाचित्रे — चित्रातील व्यक्ती सूर्योदयचे रहिवासी किंवा कर्मचारी नाहीत.',
    nav: { about: 'आमच्याबद्दल', care: 'सेवा', needs: 'गरज', gallery: 'गॅलरी', contact: 'संपर्क', support: 'पाठिंबा द्या' },
    quickAction: { eyebrow: 'थेट संवाद', title: 'या कार्याला साथ द्या', body: 'सध्याच्या गरजा, स्वयंसेवा किंवा भेटीबद्दल टीमला विचारा.', volunteer: 'स्वयंसेवा', share: 'शेअर करा' },
    hero: {
      eyebrow: 'सन्मानपूर्वक वृद्धसेवा · पुणे, भारत',
      title: 'आयुष्याच्या प्रत्येक टप्प्यावर आपलेपणा हवा.',
      description: 'जिव्हाळ्याचा समुदाय, रोजच्या जीवनात विचारपूर्वक मदत आणि सन्मानाने जगण्याचा विश्वास.',
      primary: 'आमच्या कामाला पाठिंबा द्या',
      secondary: 'आमची गोष्ट जाणून घ्या',
    },
    about: { title: 'वृद्धांसाठी सुरक्षित, प्रेमळ घर', text: 'दयाळूपणा आणि समुदायाच्या मूल्यांवर आधारित सूर्योदय वृद्धाश्रम ज्येष्ठ नागरिकांना आराम, दिनचर्या आणि आपुलकी प्रदान करते. आमची टीम प्रत्येक रहिवाश्याला दैनिक आरोग्य, साथ आणि सन्मानजनक सेवा देते.', mission: 'ज्येष्ठांना सन्मानपूर्वक सेवा, सुरक्षितता, पोषण आणि आपुलकीच्या समुदायाचा आधार देणे, जेणेकरून ते सन्मानाने राहू शकतील.' },
    care: { title: 'येथे सेवा कशी दिसते', items: ['दैनिक वैयक्तिक सेवा, सहानुभूति आणि सन्मानासह', 'पौष्टिक जेवण, पाणी आणि औषध मदत', 'नियमित आरोग्य तपासणी आणि शांत वातावरण', 'सामाजिक जोड, क्रियाकलाप आणि साथ'] },
    needs: { title: 'सध्याची गरज', subtitle: 'या गरजांमुळे आम्ही रहिवाश्यांसाठी आरामदायक आणि स्थिर दिनचर्या तयार करतो.' },
    impact: { title: 'मदत जी आराम आणि स्थिरता देते', stats: [{ value: 'सेवा', label: 'वैयक्तिक सेवा आणि मदत' }, { value: 'जेवण', label: 'पोषण' }, { value: 'समुदाय', label: 'साथ आणि आपलेपणा' }] },
    help: { title: 'मदत करण्याचे मार्ग', donate: 'दान करा', volunteer: 'स्वयंसेवक', share: 'शेअर करा', descriptions: ['सध्याच्या, खात्रीशीर गरजा आणि मदतीच्या मार्गांसाठी संस्थेशी थेट संपर्क साधा.', 'भेट किंवा स्वयंसेवेसाठी टीमशी संवाद साधा.', 'आपल्या कुटुंबासोबत आणि समुदायात संस्थेचे ध्येय शेअर करा.'] },
    team: { title: 'दयाळूपणाने चालणारी सेवा', items: [{ name: 'संस्थेचे नेतृत्व', role: 'सेवा समन्वय', description: 'रहिवाशांच्या मदतीचे आणि समुदाय सहकार्याचे समन्वय करते.' }, { name: 'सेवा टीम', role: 'रहिवासी मदत', description: 'दैनिक सहाय्य, सुरक्षा आणि सन्मानजनक वैयक्तिक सेवा देते.' }, { name: 'आरोग्य टीम', role: 'आरोग्य आणि पोषण', description: 'प्रत्येक रहिवाश्यासाठी दिनचर्या, पोषण आणि आरोग्य समर्थन करते.' }] },
    faq: { title: 'वारंवार विचारले जाणारे प्रश्न', items: [{ q: 'सूर्योदय वृद्धाश्रम कोणाला मदत करतो?', a: 'हे अशा ज्येष्ठ नागरिकांना आधार देते ज्यांना साथ, दैनिक सेवा आणि सुरक्षित, सन्मानपूर्ण जीवनाची गरज असते.' }, { q: 'मी भेट देऊ शकतो का?', a: 'होय, खालील संपर्क तपशील वापरून तुम्ही प्रश्न विचारू शकता किंवा भेटीची व्यवस्था करू शकता.' }, { q: 'मी कसे मदत करू शकतो?', a: 'तुम्ही दान, स्वयंसेवा किंवा माहिती सोशल माध्यमांत शेअर करून मदत करू शकता.' }] },
    contact: { title: 'आमच्याशी संपर्क साधा', email: 'ईमेल', phone: 'कॉल', address: 'भेट द्या', whatsapp: 'व्हॉट्सॲप' },
    footer: 'सूर्योदय वृद्धाश्रम · गरिमा आणि समुदायाशी जोडलेली सेवा.',
  },
};

const needs = [
  { title: { en: 'Nutritious meals and hydration', hi: 'पौष्टिक भोजन और जलयोजन', mr: 'पौष्टिक जेवण आणि पाण्याची गरज' }, description: { en: 'Fresh, balanced food and regular hydration support for residents with varied dietary requirements.', hi: 'विभिन्न आहार संबंधी ज़रूरतों वाले निवासियों के लिए ताज़ा, संतुलित भोजन और नियमित जलयोजन सहायता।', mr: 'विविध आहाराच्या गरजा असलेल्या रहिवाशांसाठी ताजे, संतुलित अन्न आणि नियमित पाणीपुरवठा.' } },
  { title: { en: 'Regular health checkups', hi: 'नियमित स्वास्थ्य जांच', mr: 'नियमित आरोग्य तपासणी' }, description: { en: 'Routine monitoring, medication support, and timely medical attention for residents.', hi: 'निवासियों के लिए नियमित निगरानी, दवा सहायता और समय पर चिकित्सा देखभाल।', mr: 'रहिवाशांसाठी नियमित देखरेख, औषधोपचारासाठी मदत आणि वेळेवर वैद्यकीय सेवा.' } },
  { title: { en: 'Companionship and activities', hi: 'साथ और गतिविधियाँ', mr: 'साथ आणि उपक्रम' }, description: { en: 'Meaningful daily engagement, emotional support, and social activity for a happy routine.', hi: 'सुखद दिनचर्या के लिए सार्थक दैनिक जुड़ाव, भावनात्मक सहयोग और सामाजिक गतिविधियाँ।', mr: 'आनंदी दिनक्रमासाठी अर्थपूर्ण दैनंदिन सहभाग, भावनिक आधार आणि सामाजिक उपक्रम.' } },
];

const emptyTeam = [
  { id: 't1', name: 'Organization leadership', role: 'Care coordination', description: 'Coordinates resident support and community partnerships.' },
  { id: 't2', name: 'Care Team', role: 'Resident support', description: 'Daily personal care, empathy, and practical support for a safe, dignified routine.' },
  { id: 't3', name: 'Wellbeing Team', role: 'Health & nutrition', description: 'Monitoring health needs, nourishment, and comfort to support better daily wellbeing.' },
];

const gallery = [
  { id: 'g1', src: stockImages.community, caption: { en: 'Older women sharing a moment', hi: 'साथ बितातीं बुज़ुर्ग महिलाएँ', mr: 'एकत्र वेळ घालवणाऱ्या ज्येष्ठ महिला' } },
  { id: 'g2', src: stockImages.family, caption: { en: 'A grandmother and young family member', hi: 'दादी और परिवार का एक नन्हा सदस्य', mr: 'आजी आणि कुटुंबातील लहान सदस्य' } },
  { id: 'g3', src: stockImages.dailyLife, caption: { en: 'An older man enjoying time outdoors', hi: 'बाहर समय बिताते एक बुज़ुर्ग', mr: 'बाहेर वेळ घालवणारे ज्येष्ठ गृहस्थ' } },
  { id: 'g4', src: stockImages.elderWoman, caption: { en: 'An older woman outdoors in India', hi: 'भारत में बाहर बैठी एक बुज़ुर्ग महिला', mr: 'भारतात बाहेर बसलेली एक ज्येष्ठ महिला' } },
];

export default function HomePage() {
  const [language, setLanguage] = useState('en');
  const [selectedImage, setSelectedImage] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [siteDataError, setSiteDataError] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/site', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load current site content.');
        return response.json();
      })
      .then((data) => {
        if (active) setSiteData(data);
      })
      .catch(() => {
        if (active) setSiteDataError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return undefined;

    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll('button');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) previousFocus.focus();
    };
  }, [selectedImage]);

  const content = useMemo(() => translations[language] || translations.en, [language]);
  const displayNeeds = siteData?.needs?.map((need, index) => {
    const defaultIndex = { nutrition: 0, medical: 1, companionship: 2 }[need.id];
    const defaultNeed = needs[defaultIndex];
    const isDefaultNeed = defaultNeed && need.id === ['nutrition', 'medical', 'companionship'][defaultIndex];
    return {
      ...need,
      title: isDefaultNeed && need.title === defaultNeed.title.en ? defaultNeed.title[language] : need.title,
      description: isDefaultNeed && need.description === defaultNeed.description.en ? defaultNeed.description[language] : need.description,
    };
  }) || needs.map((need) => ({
    title: need.title[language],
    description: need.description[language],
  }));
  const legacyGalleryTitles = ['Daily companionship', 'Wellbeing support', 'Nutritious meals', 'Shared moments'];
  const displayGallery = siteData?.gallery?.map((item) => {
    const defaultImage = gallery.find((entry) => entry.id === item.id);
    const caption = defaultImage && (
      item.title === defaultImage.caption.en || legacyGalleryTitles[gallery.indexOf(defaultImage)] === item.title
    ) ? defaultImage.caption[language] : item.title;
    return { src: item.image, caption, description: item.description };
  }) || gallery.map((item) => ({ src: item.src, caption: item.caption[language] }));
  const displayTeam = siteData?.team?.map((person, index) => {
    const defaultIndex = { t1: 0, t2: 1, t3: 2 }[person.id];
    const defaultPerson = emptyTeam[defaultIndex];
    const translatedPerson = content.team.items[defaultIndex] || person;
    return {
      ...person,
      name: defaultPerson && person.name === defaultPerson.name ? translatedPerson.name : person.name,
      role: defaultPerson && person.role === defaultPerson.role ? translatedPerson.role : person.role,
      description: defaultPerson && person.description === defaultPerson.description
        ? translatedPerson.description
        : person.description,
    };
  }) || content.team.items;
  const organizationName = siteData?.brand?.name || 'Suryoday Vruddhashram';
  const contactEmail = siteData?.contact?.email || 'tejaswifoundation2013@gmail.com';
  const contactPhone = siteData?.contact?.phone || '+91 9604516653';
  const contactAddress = siteData?.contact?.address || 'Mahadeev Nagar, Dhayri, Pune 411041, India';
  const mapUrl = siteData?.contact?.mapUrl || 'https://maps.google.com/?q=Mahadeev+Nagar,+Dhayri,+Pune+411041,+India';
  const defaultAbout = 'Suryoday Vruddhashram, supported by Tejaswi Foundation, is dedicated to residential elder care, companionship, and daily wellbeing for senior citizens.';
  const defaultMission = 'To support elders with respectful care, safety, nourishment, and a warm community where they can live with dignity.';
  const aboutText = siteData?.organization?.about === defaultAbout ? content.about.text : siteData?.organization?.about || content.about.text;
  const missionText = siteData?.organization?.mission === defaultMission ? content.about.mission : siteData?.organization?.mission || content.about.mission;
  const phoneHref = `tel:${contactPhone.replace(/[^\d+]/g, '')}`;
  const whatsappHref = `https://wa.me/${contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    siteData?.contact?.whatsappMessage || "Hi! I’d like to know more about Suryoday Vruddhashram and your services."
  )}`;
  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    saveLanguage(nextLanguage);
    setNavOpen(false);
  };
  const navigationItems = [
    ['about', content.nav.about],
    ['care', content.nav.care],
    ['needs', content.nav.needs],
    ['gallery', content.nav.gallery],
    ['contact', content.nav.contact],
  ];

  const handleShare = async () => {
    const shareText = 'Suryoday Vruddhashram — compassionate elder care and community support.';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Suryoday Vruddhashram', text: shareText, url: window.location.href });
        return;
      }
    } catch {
      // fall through to clipboard if share is canceled or unsupported
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      window.alert('Link copied to your clipboard.');
    } catch {
      window.alert('Sharing is not available on this browser.');
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#282b28]">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header sticky top-0 z-40 border-b border-[#e6e0d3] bg-[#faf7f0]/95 backdrop-blur-md">
        <div className="section-shell flex items-center justify-between gap-2 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="brand-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b89a62]/50 bg-[#173d32] text-lg text-[#faf7f0]">☀</div>
            <div className="hidden min-w-0 min-[220px]:block">
              <div className="truncate text-base font-semibold text-[#163d32] md:text-lg">{organizationName}</div>
              <div className="truncate text-[11px] uppercase tracking-[0.18em] text-[#5b615d]">Tejaswi Foundation</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#2d342f] md:flex">
            {navigationItems.map(([id, label]) => <a key={id} href={`#${id}`} className="hover:text-[#24745a]">{label}</a>)}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
            <button
              type="button"
              className="rounded-full border border-[#d6e5df] bg-white p-2 text-[#163d32] md:hidden"
              aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={navOpen}
              aria-controls="mobile-navigation"
              onClick={() => setNavOpen((open) => !open)}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <a href="#contact" className="primary-button hidden sm:inline-flex">{content.nav.support}</a>
          </div>
        </div>
        {navOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="section-shell flex flex-col gap-1 border-t border-[#e6e0d3] py-3 md:hidden">
            {navigationItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setNavOpen(false)} className="rounded-lg px-3 py-3 font-medium text-[#163d32] hover:bg-white">
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {siteDataError && (
        <p role="status" className="bg-[#fff4d6] px-4 py-2 text-center text-sm text-[#4f3d13]">
          {language === 'hi' ? 'नई जानकारी लोड नहीं हो सकी। उपलब्ध प्रकाशित जानकारी दिखाई जा रही है।' : language === 'mr' ? 'नवीन माहिती लोड होऊ शकली नाही. उपलब्ध प्रकाशित माहिती दाखवली जात आहे.' : 'We couldn’t refresh the latest site information. Showing the available published details.'}
        </p>
      )}

      <section id="main-content" tabIndex="-1" className="hero-section">
        <div className="section-shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><Sparkles aria-hidden="true" className="h-4 w-4" />{content.hero.eyebrow}</p>
              <h1 className="editorial-title text-balance">
                {content.hero.title}
              </h1>
              <p className="hero-description">
                {content.hero.description}
              </p>
              <div className="hero-actions">
                <a href="#contact" className="primary-button inline-flex items-center justify-center gap-2">
                  {content.hero.primary}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#about" className="secondary-button inline-flex items-center justify-center gap-2">
                  {content.hero.secondary}
                </a>
              </div>
              <p className="hero-signature">{organizationName}<span aria-hidden="true"> · </span>{contactAddress.split(',').slice(-2).join(',').trim()}</p>
            </div>

            <figure className="hero-photo">
              <div className="hero-photo-frame">
                <Image
                  src={stockImages.hero}
                  alt={language === 'hi' ? 'भारतीय बुज़ुर्ग दंपति का प्रतिनिधि स्टॉक फ़ोटो; वे सूर्योदय के निवासी नहीं हैं।' : language === 'mr' ? 'भारतीय ज्येष्ठ जोडप्याचे प्रतिनिधिक स्टॉक छायाचित्र; ते सूर्योदयचे रहिवासी नाहीत.' : 'Representative stock photograph of an Indian older couple sharing a quiet moment outdoors; they are not Suryoday residents.'}
                  fill
                  sizes="(max-width: 768px) 100vw, 54vw"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption><span>{content.stockNote}</span><a href="https://www.pexels.com/photo/portrait-of-elderly-couple-in-traditional-clothing-19811308/" target="_blank" rel="noreferrer">Photo: Ekam Juneja / Pexels</a></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="about" className="editorial-section">
        <div className="section-shell about-grid">
          <figure className="about-photo">
            <div className="about-photo-frame">
              <Image src={stockImages.family} alt={language === 'hi' ? 'भारतीय दादी और परिवार के एक नन्हे सदस्य का प्रतिनिधि स्टॉक फ़ोटो; वे सूर्योदय के निवासी नहीं हैं।' : language === 'mr' ? 'भारतीय आजी आणि कुटुंबातील लहान सदस्याचे प्रतिनिधिक स्टॉक छायाचित्र; त्या सूर्योदयच्या रहिवासी नाहीत.' : 'Representative stock photograph of an Indian grandmother with a young family member; not a Suryoday resident.'} fill sizes="(max-width: 768px) 100vw, 48vw" className="object-cover" />
            </div>
            <figcaption>{content.stockNote} <a href="https://www.pexels.com/photo/joyful-moment-between-grandmother-and-child-33786766/" target="_blank" rel="noreferrer">Photo: Rakibul alam khan / Pexels</a></figcaption>
          </figure>

          <div className="about-copy">
            <p className="section-kicker">{content.nav.about}</p>
            <h2 className="section-title">{content.about.title}</h2>
            <p className="section-lede">{aboutText}</p>
            <blockquote className="mission-quote">
              <span>{language === 'hi' ? 'हमारा दृष्टिकोण' : language === 'mr' ? 'आमचा दृष्टिकोन' : 'Our approach'}</span>
              <p>{missionText}</p>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="care" className="care-section">
        <div className="section-shell">
          <div className="section-heading-row">
            <div><p className="section-kicker">{content.nav.care}</p><h2 className="section-title">{content.care.title}</h2></div>
            <p className="section-aside">{siteData?.organization?.tagline || content.about.mission}</p>
          </div>
          <div className="care-list">
            {content.care.items.map((item, index) => (
              <article key={item} className="care-item">
                <span className="care-index">0{index + 1}</span>
                <p>{item}</p>
                <Check aria-hidden="true" className="care-check" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="needs" className="needs-section">
        <div className="section-shell">
          <div className="needs-heading">
            <div><p className="section-kicker">{content.nav.needs}</p><h2 className="section-title">{content.needs.title}</h2></div>
            <p>{content.needs.subtitle}</p>
          </div>
          <div className="needs-layout">
            <div className="needs-list">
              {displayNeeds.map((need, index) => (
                <article key={need.id || need.title} className="need-row">
                  <span className="need-number">0{index + 1}</span>
                  <div><span className="need-status">{language === 'hi' ? 'प्रकाशित आवश्यकता' : language === 'mr' ? 'प्रकाशित गरज' : 'Published need'}</span><h3>{need.title}</h3><p>{need.description}</p></div>
                  <ChevronRight aria-hidden="true" />
                </article>
              ))}
            </div>
            <figure className="needs-photo">
              <Image src={stockImages.dailyLife} alt={language === 'hi' ? 'बाहर बैठे एक बुज़ुर्ग भारतीय पुरुष का प्रतिनिधि स्टॉक फ़ोटो; वे सूर्योदय के निवासी नहीं हैं।' : language === 'mr' ? 'बाहेर बसलेल्या ज्येष्ठ भारतीय गृहस्थाचे प्रतिनिधिक स्टॉक छायाचित्र; ते सूर्योदयचे रहिवासी नाहीत.' : 'Representative stock photograph of an older Indian man outdoors; not a Suryoday resident.'} fill sizes="(max-width: 900px) 100vw, 38vw" className="object-cover" />
              <figcaption>{content.stockNote} <a href="https://www.pexels.com/photo/serene-outdoor-lunchtime-for-elderly-man-in-park-28589341/" target="_blank" rel="noreferrer">Photo: Nishant Aneja / Pexels</a></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="impact-section" aria-labelledby="impact-title">
        <div className="section-shell impact-inner">
          <p className="section-kicker">{language === 'hi' ? 'सार्थक सहयोग' : language === 'mr' ? 'अर्थपूर्ण साथ' : 'A more human measure'}</p>
          <h2 id="impact-title" className="impact-title">{content.impact.title}</h2>
          <p>{missionText}</p>
          <a href="#contact" className="impact-link">{content.hero.primary}<ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section id="help" className="help-section">
        <div className="section-shell">
          <div className="section-heading-row">
            <div><p className="section-kicker">{language === 'hi' ? 'सहभागी बनें' : language === 'mr' ? 'सहभागी व्हा' : 'Be part of it'}</p><h2 className="section-title">{content.help.title}</h2></div>
            <p className="section-aside">{language === 'hi' ? 'हर मदद की शुरुआत एक बातचीत से होती है।' : language === 'mr' ? 'प्रत्येक मदतीची सुरुवात संवादातून होते.' : 'Every act of support begins with a conversation.'}</p>
          </div>
          <div className="help-grid">
            {[{ icon: Heart, label: content.help.donate, text: content.help.descriptions[0] }, { icon: Users, label: content.help.volunteer, text: content.help.descriptions[1] }, { icon: Share2, label: content.help.share, text: content.help.descriptions[2] }].map((card, index) => (
              <article key={card.label} className="help-item">
                <div className="help-item-top"><span>0{index + 1}</span><card.icon aria-hidden="true" /></div>
                <h3>{card.label}</h3>
                <p>{card.text}</p>
                {card.label === content.help.share ? (
                  <button type="button" onClick={handleShare} className="help-action">
                    {card.label}<ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(card.label === content.help.donate ? 'Ways to contribute' : 'Volunteer inquiry')}`}
                    className="help-action"
                  >
                    {card.label}<ChevronRight className="h-4 w-4" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="team-section">
        <div className="section-shell">
          <div className="team-heading"><p className="section-kicker">{language === 'hi' ? 'देखभाल का आधार' : language === 'mr' ? 'सेवेचा आधार' : 'The people behind care'}</p><h2 className="section-title">{content.team.title}</h2>
          </div>
          <div className="team-grid">
            {displayTeam.map((person, index) => (
              <article key={person.name} className="team-item">
                <span className="team-number">0{index + 1}</span>
                <p className="team-role">{person.role}</p>
                <h3>{person.name}</h3>
                <p className="team-description">{person.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-shell">
          <div className="section-heading-row">
            <div><p className="section-kicker">{content.nav.gallery}</p><h2 className="section-title">{language === 'hi' ? 'जीवन के साझा पल' : language === 'mr' ? 'आयुष्यातील सामायिक क्षण' : 'Life, shared together'}</h2></div>
            <p className="section-aside">{content.stockNote}</p>
          </div>
          <div className="gallery-grid">
            {displayGallery.map((image, index) => (
              <button type="button" key={image.src} onClick={() => setSelectedImage(image)} className={`gallery-tile gallery-tile-${index + 1}`} aria-label={`${image.caption}. ${content.stockNote}`}>
                <Image src={image.src} alt={`${image.caption}. ${content.stockNote}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 34vw" className="gallery-image" onError={(event) => { event.currentTarget.src = stockImages.community; }} />
                <span className="gallery-caption">{image.caption}<small>{language === 'hi' ? 'प्रतिनिधि स्टॉक फ़ोटो' : language === 'mr' ? 'प्रतिनिधिक स्टॉक फोटो' : 'Representative stock photo'}</small></span>
              </button>
            ))}
          </div>
          <div className="gallery-credits">
            {[
              ['Ekam Juneja', 'https://www.pexels.com/photo/portrait-of-elderly-couple-in-traditional-clothing-19811308/'],
              ['Rakibul alam khan', 'https://www.pexels.com/photo/joyful-moment-between-grandmother-and-child-33786766/'],
              ['Puneet Singh Rawat', 'https://www.pexels.com/photo/elderly-women-in-traditional-clothing-18597902/'],
              ['Nishant Aneja', 'https://www.pexels.com/photo/serene-outdoor-lunchtime-for-elderly-man-in-park-28589341/'],
              ['Varinder Kumar Kumar', 'https://www.pexels.com/photo/elderly-woman-sitting-outdoors-in-nakodar-india-32224339/'],
            ].map(([photographer, source]) => <a href={source} key={photographer} target="_blank" rel="noreferrer">{photographer} / Pexels</a>)}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="section-shell grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">{content.faq.title}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.faq.title}</h2>
          </div>
          <div className="space-y-4">
            {content.faq.items.map((item) => (
              <div key={item.q} className="rounded-[1.5rem] border border-[#dfe7e2] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#edf7f3] text-[#24745a]">
                    <CircleHelp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#163d32]">{item.q}</div>
                    <p className="mt-2 text-base leading-7 text-[#4f5854]">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#163d32] py-20 text-white md:py-28">
        <div className="section-shell grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9e7e2]">{content.contact.title}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">{content.contact.title}</h2>
            <div className="mt-8 space-y-5">
              <a href={`mailto:${contactEmail}`} className="flex min-w-0 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <Mail className="h-5 w-5 text-[#c8a96b]" />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#d9e7e2]">{content.contact.email}</div>
                  <div className="mt-1 break-all text-lg">{contactEmail}</div>
                </div>
              </a>
              <a href={phoneHref} className="flex min-w-0 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <PhoneIcon />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#d9e7e2]">{content.contact.phone}</div>
                  <div className="mt-1 text-lg">{contactPhone}</div>
                </div>
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <PhoneIcon />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#d9e7e2]">{content.contact.whatsapp}</div>
                  <div className="mt-1 text-lg">{contactPhone}</div>
                </div>
              </a>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <MapPin className="h-5 w-5 text-[#c8a96b]" />
                <div className="min-w-0 break-words">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#d9e7e2]">{content.contact.address}</div>
                  <div className="mt-1 text-lg">{contactAddress}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#f7f2ea] p-6 text-[#163d32] shadow-xl">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">Quick action</div>
              <h3 className="mt-4 text-2xl font-semibold text-[#163d32]">Support the mission</h3>
              <p className="mt-4 text-base leading-7 text-[#4f5854]">Your generosity helps fund everyday care, meals, companionship, and a calm environment for elders.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={`mailto:${contactEmail}?subject=${encodeURIComponent('Volunteer support')}`} className="secondary-button inline-flex items-center justify-center">Volunteer</a>
                <button type="button" onClick={handleShare} className="primary-button inline-flex items-center justify-center gap-2">Share</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e4dfd5] bg-[#f9f5ee] py-8">
        <div className="section-shell flex flex-col items-center justify-between gap-3 text-center text-sm text-[#4f5854] md:flex-row md:text-left">
          <div>{organizationName} · {siteData?.brand?.subtitle || content.footer.split('·')[1]?.trim()}</div>
          <a href="/admin" className="text-[#24745a] hover:text-[#163d32]">Admin login</a>
        </div>
      </footer>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#163d32]/75 p-4" onClick={() => setSelectedImage(null)}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={selectedImage.caption} className="relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button ref={closeButtonRef} type="button" aria-label="Close image" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#163d32]">✕</button>
            <div className="relative aspect-[4/3] w-full bg-[#e4ebdd]">
              <Image src={selectedImage.src} alt={`${selectedImage.caption}. ${content.stockNote}`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" onError={(event) => { event.currentTarget.src = stockImages.community; }} />
            </div>
            <div className="p-6">
              <div className="text-2xl font-semibold text-[#163d32]">{selectedImage.caption}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#c8a96b]" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 4.18 2 2 0 0 1 5.06 2h3a2 2 0 0 1 2 1.72l.43 2.08a2 2 0 0 1-.57 1.82l-1.26 1.26a16 16 0 0 0 7.95 7.95l1.26-1.26a2 2 0 0 1 1.82-.57l2.08.43A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
