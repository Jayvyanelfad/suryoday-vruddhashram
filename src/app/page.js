'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ChevronRight, CircleHelp, Heart, Mail, MapPin, Menu, ShieldCheck, Share2, Sparkles, Users, X } from 'lucide-react';
import LanguageSwitcher from '@/components/charity/LanguageSwitcher';
import { getSavedLanguage, saveLanguage } from '@/lib/language-preference';

const translations = {
  en: {
    nav: { about: 'About', care: 'Care', needs: 'Needs', gallery: 'Gallery', contact: 'Contact' },
    hero: {
      eyebrow: 'Dignity and care for every senior year',
      title: 'A calmer, kinder place to grow older with dignity.',
      description: 'Suryoday Vruddhashram offers compassionate elder care, daily support, and a warm community where every resident feels respected, safe, and at home.',
      primary: 'Support our work',
      secondary: 'Explore care services',
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
    nav: { about: 'हमारे बारे में', care: 'देखभाल', needs: 'ज़रूरतें', gallery: 'गैलरी', contact: 'संपर्क' },
    hero: {
      eyebrow: 'हर वरिष्ठ वर्ष के लिए गरिमा और देखभाल',
      title: 'शांत, दयालु और सम्मानपूर्ण जीवन का स्थान।',
      description: 'सूर्योदय वृद्धाश्रम वरिष्ठ नागरिकों को स्नेहपूर्ण देखभाल, दैनिक सहयोग और एक गरिमामय समुदाय देता है जहाँ हर निवासी सुरक्षित, सम्मानित और घर जैसा महसूस करता है।',
      primary: 'हमारा सहयोग करें',
      secondary: 'सेवाओं की जानकारी देखें',
    },
    about: { title: 'बुजुर्गों के लिए सुरक्षित, स्नेही घर', text: 'करुणा और समुदाय के मूल्यों पर आधारित सूर्योदय वृद्धाश्रम वरिष्ठ नागरिकों को आराम, दिनचर्या और अपनापन देता है। हमारी टीम हर निवासी को दैनिक कल्याण, साथ और सम्मानजनक देखभाल प्रदान करती है।', mission: 'बुजुर्गों को सम्मानपूर्ण देखभाल, सुरक्षा, पोषण और ऐसा स्नेही समुदाय देना जहाँ वे गरिमा के साथ रह सकें।' },
    care: { title: 'यहाँ देखभाल कैसी होती है', items: ['दैनिक व्यक्तिगत देखभाल, सहानुभूति और सम्मान के साथ', 'पौष्टिक भोजन, जलयोजन और दवा सहायता', 'नियमित स्वास्थ्य जाँच और शांत वातावरण', 'सामाजिक जुड़ाव, गतिविधियाँ और साथ'] },
    needs: { title: 'वर्तमान प्राथमिकताएँ', subtitle: 'इन आवश्यकताओं से हम निवासियों के लिए आरामदायक और स्थिर दिनचर्या बनाते हैं।' },
    impact: { title: 'सहयोग जो आराम और स्थिरता देता है', stats: [{ value: 'देखभाल', label: 'व्यक्तिगत देखभाल और सहयोग' }, { value: 'भोजन', label: 'पोषण' }, { value: 'समुदाय', label: 'साथ और जुड़ाव' }] },
    help: { title: 'मदद करने के तरीके', donate: 'दान करें', volunteer: 'स्वयंसेवक', share: 'साझा करें' },
    team: { title: 'करुणा से चलती सेवा', items: [{ name: 'संस्था का नेतृत्व', role: 'देखभाल समन्वय', description: 'निवासियों की सहायता और सामुदायिक सहयोग का समन्वय करता है।' }, { name: 'देखभाल टीम', role: 'निवासी सहयोग', description: 'दैनिक सहायता, सुरक्षा और सम्मानपूर्ण व्यक्तिगत देखभाल प्रदान करती है।' }, { name: 'कल्याण टीम', role: 'स्वास्थ्य एवं पोषण', description: 'हर निवासी के लिए दिनचर्या, पोषण और स्वास्थ्य का समर्थन करती है।' }] },
    faq: { title: 'अक्सर पूछे जाने वाले प्रश्न', items: [{ q: 'सूर्योदय वृद्धाश्रम किसे सहयोग देता है?', a: 'यह उन बुजुर्गों को संभालता है जिन्हें परिवार की तरह सहारा, दैनिक देखभाल और सुरक्षित, सम्मानपूर्ण जीवन की ज़रूरत होती है।' }, { q: 'क्या मैं मिल सकता हूँ या बातचीत कर सकता हूँ?', a: 'हाँ, नीचे दिए गए संपर्क विवरण से बात कर सकते हैं या मुलाक़ात की व्यवस्था कर सकते हैं।' }, { q: 'मैं कैसे सहायता कर सकता हूँ?', a: 'आप दान, स्वयंसेवा या अपने परिवार/दोस्तों के साथ जानकारी साझा करके मदद कर सकते हैं।' }] },
    contact: { title: 'संपर्क करें', email: 'ईमेल', phone: 'कॉल', address: 'मिलें', whatsapp: 'व्हाट्सऐप' },
    footer: 'सूर्योदय वृद्धाश्रम · गरिमा और समुदाय से जुड़ी देखभाल।',
  },
  mr: {
    nav: { about: 'आमच्याबद्दल', care: 'सेवा', needs: 'गरज', gallery: 'गॅलरी', contact: 'संपर्क' },
    hero: {
      eyebrow: 'प्रत्येक ज्येष्ठ वर्षासाठी सन्मान आणि सेवा',
      title: 'शांत, दयाळू आणि सन्मानपूर्ण जीवनाची जागा.',
      description: 'सूर्योदय वृद्धाश्रम ज्येष्ठ नागरिकांना दयाळू सेवा, दैनिक आधारभूत सहकार्य आणि एक सन्माननीय समुदाय देतो, जिथे प्रत्येक रहिवासी सुरक्षित, सन्मानित आणि घरासारखा वाटतो.',
      primary: 'आमच्या कामाला पाठिंबा द्या',
      secondary: 'सेवांची माहिती पहा',
    },
    about: { title: 'वृद्धांसाठी सुरक्षित, प्रेमळ घर', text: 'दयाळूपणा आणि समुदायाच्या मूल्यांवर आधारित सूर्योदय वृद्धाश्रम ज्येष्ठ नागरिकांना आराम, दिनचर्या आणि आपुलकी प्रदान करते. आमची टीम प्रत्येक रहिवाश्याला दैनिक आरोग्य, साथ आणि सन्मानजनक सेवा देते.', mission: 'ज्येष्ठांना सन्मानपूर्वक सेवा, सुरक्षितता, पोषण आणि आपुलकीच्या समुदायाचा आधार देणे, जेणेकरून ते सन्मानाने राहू शकतील.' },
    care: { title: 'येथे सेवा कशी दिसते', items: ['दैनिक वैयक्तिक सेवा, सहानुभूति आणि सन्मानासह', 'पौष्टिक जेवण, पाणी आणि औषध मदत', 'नियमित आरोग्य तपासणी आणि शांत वातावरण', 'सामाजिक जोड, क्रियाकलाप आणि साथ'] },
    needs: { title: 'सध्याची गरज', subtitle: 'या गरजांमुळे आम्ही रहिवाश्यांसाठी आरामदायक आणि स्थिर दिनचर्या तयार करतो.' },
    impact: { title: 'मदत जी आराम आणि स्थिरता देते', stats: [{ value: 'सेवा', label: 'वैयक्तिक सेवा आणि मदत' }, { value: 'जेवण', label: 'पोषण' }, { value: 'समुदाय', label: 'साथ आणि आपलेपणा' }] },
    help: { title: 'मदत करण्याचे मार्ग', donate: 'दान करा', volunteer: 'स्वयंसेवक', share: 'शेअर करा' },
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

const stats = [
  { id: 'care', value: 'Care', label: { en: 'Personal care and support', hi: 'व्यक्तिगत देखभाल और सहयोग', mr: 'वैयक्तिक सेवा आणि मदत' } },
  { id: 'meals', value: 'Meals', label: { en: 'Nourishment', hi: 'पोषण', mr: 'पोषण' } },
  { id: 'community', value: 'Community', label: { en: 'Companionship', hi: 'साथ और जुड़ाव', mr: 'साथ आणि आपलेपणा' } },
];

const emptyTeam = [
  { id: 't1', name: 'Organization leadership', role: 'Care coordination', description: 'Coordinates resident support and community partnerships.' },
  { id: 't2', name: 'Care Team', role: 'Resident support', description: 'Daily personal care, empathy, and practical support for a safe, dignified routine.' },
  { id: 't3', name: 'Wellbeing Team', role: 'Health & nutrition', description: 'Monitoring health needs, nourishment, and comfort to support better daily wellbeing.' },
];

const gallery = [
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', caption: { en: 'Daily companionship', hi: 'दैनिक साथ', mr: 'दैनंदिन साथ' } },
  { src: 'https://images.unsplash.com/photo-1544022592-4f1881e4ca34?auto=format&fit=crop&w=900&q=80', caption: { en: 'Wellbeing support', hi: 'कल्याण सहायता', mr: 'आरोग्य मदत' } },
  { src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80', caption: { en: 'Nutritious meals', hi: 'पौष्टिक भोजन', mr: 'पौष्टिक जेवण' } },
  { src: 'https://images.unsplash.com/photo-1519944519054-4d4b1b1dce8a?auto=format&fit=crop&w=900&q=80', caption: { en: 'Shared moments', hi: 'साझे पल', mr: 'सामील क्षण' } },
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
  const displayStats = siteData?.stats?.map((stat, index) => {
    const defaultIndex = { care: 0, meals: 1, community: 2 }[stat.id];
    const defaultStat = stats[defaultIndex];
    return {
      ...stat,
      label: defaultStat && stat.label === defaultStat.label.en ? defaultStat.label[language] : stat.label,
    };
  }) || stats.map((stat) => ({ value: stat.value, label: stat.label[language] }));
  const displayGallery = siteData?.gallery?.map((item, index) => {
    const defaultImage = gallery[index];
    return {
      src: item.image,
      caption: defaultImage?.caption.en === item.title ? defaultImage.caption[language] : item.title,
      description: item.description,
    };
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
      <header className="sticky top-0 z-40 border-b border-[#e6e0d3] bg-[#faf7f0]/90 backdrop-blur-md">
        <div className="section-shell flex items-center justify-between gap-2 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#24745a] to-[#163d32] text-lg text-white shadow-md">☀</div>
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
            <a href="#contact" className="primary-button hidden sm:inline-flex">Support</a>
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
          We couldn’t refresh the latest site information. Showing the available published details.
        </p>
      )}

      <section id="main-content" tabIndex="-1" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(36,116,90,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(200,169,107,0.15),transparent_30%)]" />
        <div className="section-shell relative grid grid-cols-1 items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9e7e2] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#24745a]">
              <Sparkles className="h-4 w-4" />
              {content.hero.eyebrow}
            </div>
            <h1 className="max-w-xl text-balance text-4xl font-semibold leading-tight text-[#163d32] md:text-6xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#4f5854]">
              {content.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="primary-button inline-flex items-center justify-center gap-2">
                {content.hero.primary}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#care" className="secondary-button inline-flex items-center justify-center gap-2">
                {content.hero.secondary}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#4d5b57]">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#24745a]" /> Respectful care</div>
              <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-[#24745a]" /> Compassion-first</div>
            </div>
          </div>

          <div className="panel-surface relative overflow-hidden rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(22,61,50,0.1)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
                alt="Representative stock photograph"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/30 bg-[#163d32]/80 p-5 text-white shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#d9e7e2]">Community care</div>
                  <div className="mt-2 text-2xl font-semibold">Daily comfort</div>
                </div>
                <div className="rounded-full bg-[#c8a96b] p-2 text-[#163d32]">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-28">
        <div className="section-shell grid grid-cols-1 gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#163d32] p-4 shadow-[0_20px_50px_rgba(22,61,50,0.15)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80" alt="Representative stock photograph" fill className="object-cover" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">{content.nav.about}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.about.title}</h2>
            <p className="mt-6 text-lg leading-8 text-[#4f5854]">{aboutText}</p>
            <div className="mt-8 rounded-[1.5rem] border border-[#dfe7e2] bg-[#f9f5ee] p-6 text-[#163d32]">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#24745a]">Our approach</div>
              <p className="text-lg leading-8">{missionText}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="care" className="bg-[#f3efe7] py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">{content.nav.care}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.care.title}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.care.items.map((item, index) => (
              <div key={item} className="panel-surface rounded-[1.75rem] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4f0] text-[#24745a]">
                  <Check className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#24745a]">0{index + 1}</div>
                <p className="mt-4 text-lg leading-8 text-[#2b312d]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="needs" className="py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">{content.nav.needs}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.needs.title}</h2>
            <p className="mt-4 text-lg leading-8 text-[#4f5854]">{content.needs.subtitle}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {displayNeeds.map((need, index) => (
              <div key={need.id || need.title} className="rounded-[1.75rem] border border-[#dde7e1] bg-white p-7 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ead6] text-[#c8a96b]">
                  {index === 0 ? '🥗' : index === 1 ? '🩺' : '🤝'}
                </div>
                <h3 className="text-2xl font-semibold text-[#163d32]">{need.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#4f5854]">{need.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#163d32] py-20 text-white md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9e7e2]">{content.impact.title}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">{content.impact.title}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {displayStats.map((item) => (
              <div key={item.id || item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center">
                <div className="text-4xl font-semibold text-[#f1ebdd]">{item.value}</div>
                <div className="mt-3 text-lg text-[#dfe7e2]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="help" className="py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">{content.help.title}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.help.title}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[{ icon: Heart, label: content.help.donate, text: 'Ask the organization directly for current, verified ways to contribute.' }, { icon: Users, label: content.help.volunteer, text: 'Contact the team to ask about visiting or volunteering.' }, { icon: Share2, label: content.help.share, text: 'Share the mission with community networks and help plant a wider circle of support.' }].map((card) => (
              <div key={card.label} className="panel-surface rounded-[1.75rem] p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ebf4f1] text-[#24745a]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold text-[#163d32]">{card.label}</h3>
                <p className="mt-4 text-base leading-7 text-[#4f5854]">{card.text}</p>
                {card.label === content.help.share ? (
                  <button type="button" onClick={handleShare} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#163d32] px-5 py-3 font-medium text-white">
                    {card.label}<ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(card.label === content.help.donate ? 'Ways to contribute' : 'Volunteer inquiry')}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#163d32] px-5 py-3 font-medium text-white"
                  >
                    {card.label}<ChevronRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">People</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">{content.team.title}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {displayTeam.map((person) => (
              <div key={person.name} className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-[#edf0ed]">
                <div className="relative h-72">
                  <Image
                    src={person.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80'}
                    alt={`Representative stock photograph for ${person.role}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#24745a]">{person.role}</div>
                  <h3 className="mt-3 text-2xl font-semibold text-[#163d32]">{person.name}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4f5854]">{person.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-[#f3efe7] py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24745a]">Gallery</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#163d32] md:text-5xl">Moments of care</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {displayGallery.map((image) => (
              <button type="button" key={image.src} onClick={() => setSelectedImage(image)} className="group relative h-72 overflow-hidden rounded-[1.5rem] text-left shadow-sm ring-1 ring-[#e7e2d8]">
                <Image src={image.src} alt={image.caption[language]} fill className="object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163d32]/80 via-[#163d32]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="text-lg font-semibold">{image.caption[language]}</div>
                </div>
              </button>
            ))}
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
            <div className="relative aspect-[4/3] w-full">
              <Image src={selectedImage.src} alt={selectedImage.caption} fill className="object-cover" />
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
