const mongoose = require('mongoose');
const Nomination = require('../models/Nomination');

const MONGO_URI = 'mongodb+srv://KodBekhzod:tarjiV-kevwic-7cugqa@cluster0.xlbowez.mongodb.net/?appName=Cluster0'; 
// ← ЗАМЕНИ на своё имя базы

const nominations = [
  {
    title: "Современные интерпретации в изобразительном искусстве",
    slug: "modern-art",
    description: "Живопись, графика и смешанные техники с элементами переосмысления классических традиций восточной миниатюры",
    icon: "🎨",
    formats: "JPEG, PNG, TIFF",
    maxSize: "50 MB",
    maxWorks: 5
  },
  {
    title: "Декоративно-прикладное искусство",
    slug: "decorative-art",
    description: "Керамика, текстиль, ювелирное искусство, резьба и другие виды прикладного творчества",
    icon: "🏺",
    formats: "JPEG, PNG, PDF",
    maxSize: "50 MB",
    maxWorks: 5
  },
  {
    title: "Иллюстрация и книжная графика",
    slug: "illustration",
    description: "Книжная иллюстрация, графические романы и визуальное повествование",
    icon: "📖",
    formats: "JPEG, PNG, PDF",
    maxSize: "50 MB",
    maxWorks: 10
  },
  {
    title: "Цифровое искусство и мультимедиа",
    slug: "digital-art",
    description: "3D-моделирование, анимация, видео-арт, интерактивные инсталляции и AR/VR",
    icon: "💻",
    formats: "JPEG, PNG, MP4, GLB",
    maxSize: "200 MB",
    maxWorks: 3
  },
  {
    title: "Графический дизайн",
    slug: "graphic-design",
    description: "Айдентика, плакат, упаковка, типографика и визуальные коммуникации",
    icon: "✏️",
    formats: "JPEG, PNG, PDF",
    maxSize: "50 MB",
    maxWorks: 5
  },
  {
    title: "Архитектурный дизайн",
    slug: "architecture",
    description: "Дизайн интерьеров и экстерьеров с элементами традиционной архитектуры",
    icon: "🏛️",
    formats: "JPEG, PNG, PDF, MP4",
    maxSize: "100 MB",
    maxWorks: 3
  },
  {
    title: "Моделирование одежды и аксессуаров",
    slug: "fashion",
    description: "Модный дизайн, текстильный дизайн и аксессуары с культурными мотивами",
    icon: "👗",
    formats: "JPEG, PNG, PDF, MP4",
    maxSize: "100 MB",
    maxWorks: 5
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await Nomination.deleteMany({});
    console.log("Старые номинации удалены");

    await Nomination.insertMany(nominations);
    console.log("Номинации добавлены");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();