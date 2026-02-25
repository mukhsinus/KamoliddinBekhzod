// seedNominations.js
require('dotenv').config();
const mongoose = require('mongoose');
const Nomination = require('../models/Nomination');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/behzod';

const nominations = [
  {
    title: {
      ru: "Современные интерпретации в изобразительном искусстве",
      en: "Contemporary Interpretations in Fine Art"
    },
    slug: "modern-art",
    description: {
      ru: "Живопись, графика и смешанные техники с элементами переосмысления классических традиций восточной миниатюры",
      en: "Painting, graphics and mixed media with reinterpretations of classical Eastern miniature traditions"
    },
    icon: "🎨",
    formats: "JPEG, PNG, TIFF",
    maxSize: "5 MB",
    maxWorks: 5
  },
  {
    title: {
      ru: "Декоративно-прикладное искусство",
      en: "Decorative and Applied Arts"
    },
    slug: "decorative-art",
    description: {
      ru: "Керамика, текстиль, ювелирное искусство, резьба и другие виды прикладного творчества",
      en: "Ceramics, textiles, jewelry, carving and other forms of applied art"
    },
    icon: "🏺",
    formats: "JPEG, PNG, PDF",
    maxSize: "5 MB",
    maxWorks: 5
  },
  {
    title: {
      ru: "Иллюстрация и книжная графика",
      en: "Illustration and Book Graphics"
    },
    slug: "illustration",
    description: {
      ru: "Книжная иллюстрация, графические романы и визуальное повествование",
      en: "Book illustration, graphic novels and visual storytelling"
    },
    icon: "📖",
    formats: "JPEG, PNG, PDF",
    maxSize: "5 MB",
    maxWorks: 10
  },
  {
    title: {
      ru: "Цифровое искусство и мультимедиа",
      en: "Digital Art and Multimedia"
    },
    slug: "digital-art",
    description: {
      ru: "3D-моделирование, анимация, видео-арт, интерактивные инсталляции и AR/VR",
      en: "3D modeling, animation, video art, interactive installations and AR/VR"
    },
    icon: "💻",
    formats: "JPEG, PNG, MP4, GLB",
    maxSize: "5 MB",
    maxWorks: 3
  },
  {
    title: {
      ru: "Графический дизайн",
      en: "Graphic Design"
    },
    slug: "graphic-design",
    description: {
      ru: "Айдентика, плакат, упаковка, типографика и визуальные коммуникации",
      en: "Brand identity, poster design, packaging, typography and visual communications"
    },
    icon: "✏️",
    formats: "JPEG, PNG, PDF",
    maxSize: "5 MB",
    maxWorks: 5
  },
  {
    title: {
      ru: "Архитектурный дизайн",
      en: "Architectural Design"
    },
    slug: "architecture",
    description: {
      ru: "Дизайн интерьеров и экстерьеров с элементами традиционной архитектуры",
      en: "Interior and exterior design incorporating traditional architectural elements"
    },
    icon: "🏛️",
    formats: "JPEG, PNG, PDF, MP4",
    maxSize: "5 MB",
    maxWorks: 3
  },
  {
    title: {
      ru: "Моделирование одежды и аксессуаров",
      en: "Fashion and Accessory Design"
    },
    slug: "fashion",
    description: {
      ru: "Модный дизайн, текстильный дизайн и аксессуары с культурными мотивами",
      en: "Fashion design, textile design and accessories inspired by cultural motifs"
    },
    icon: "👗",
    formats: "JPEG, PNG, PDF, MP4",
    maxSize: "5 MB",
    maxWorks: 5
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Nomination.deleteMany({});
    console.log("Old nominations removed");

    await Nomination.insertMany(nominations);
    console.log("Nominations seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();