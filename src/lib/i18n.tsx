import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Lang = 'ru' | 'en';

const translations = {
  ru: {
    // Nav
    'nav.home': 'Главная',
    'nav.about': 'О конкурсе',
    'nav.nominations': 'Номинации',
    'nav.rules': 'Правила',
    'nav.faq': 'FAQ',
    'nav.biography': 'Камолиддин Бехзод',
    'nav.contacts': 'Контакты',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',

    // Hero
    'hero.title': 'Международный творческий конкурс',
    'hero.subtitle': 'имени Камолиддина Бехзода',
    'hero.description': 'Ежегодный международный конкурс, объединяющий художников со всего мира в честь великого мастера восточной миниатюры',
    'hero.cta': 'Подать заявку',
    'hero.learnMore': 'Подробнее',
    'hero.deadline': 'Приём заявок до',

    // About
    'about.title': 'О конкурсе',
    'about.subtitle': 'Традиция и современность в творческом диалоге',
    'about.description': 'Международный творческий конкурс имени Камолиддина Бехзода — ежегодное мероприятие, направленное на сохранение и развитие культурного наследия великого мастера восточной миниатюры. Конкурс объединяет художников, дизайнеров и архитекторов от 18 до 40 лет из разных стран мира.',
    'about.stage1.title': 'Этап 1: Онлайн-отбор',
    'about.stage1.description': 'Приём и оценка работ жюри в онлайн-формате',
    'about.stage2.title': 'Этап 2: Финал',
    'about.stage2.description': 'Офлайн-выставка и торжественная церемония награждения',
    'about.age': '18–40 лет',
    'about.geography': 'Международное участие',
    'about.format': 'Ежегодный конкурс',

    // Nominations
    'nominations.title': 'Номинации',
    'nominations.subtitle': 'Семь направлений творческого самовыражения',
    'nominations.apply': 'Подать заявку',
    'nominations.details': 'Подробнее',
    'nominations.deadline': 'Дедлайн подачи',
    'nominations.age': 'Возраст: 18–40 лет',
    'nominations.international': 'Международное участие',

    'nom.1.title': 'Современные интерпретации в изобразительном искусстве',
    'nom.1.desc': 'Живопись, графика и смешанные техники с элементами переосмысления классических традиций восточной миниатюры',
    'nom.2.title': 'Декоративно-прикладное искусство',
    'nom.2.desc': 'Керамика, текстиль, ювелирное искусство, резьба и другие виды прикладного творчества',
    'nom.3.title': 'Иллюстрация и книжная графика',
    'nom.3.desc': 'Книжная иллюстрация, графические романы и визуальное повествование',
    'nom.4.title': 'Цифровое искусство и мультимедиа',
    'nom.4.desc': '3D-моделирование, анимация, видео-арт, интерактивные инсталляции и AR/VR',
    'nom.5.title': 'Графический дизайн',
    'nom.5.desc': 'Айдентика, плакат, упаковка, типографика и визуальные коммуникации',
    'nom.6.title': 'Архитектурный дизайн',
    'nom.6.desc': 'Дизайн интерьеров и экстерьеров с элементами традиционной архитектуры',
    'nom.7.title': 'Моделирование одежды и аксессуаров',
    'nom.7.desc': 'Модный дизайн, текстильный дизайн и аксессуары с культурными мотивами',

    // Rules
    'rules.title': 'Правила и регламент',
    'rules.subtitle': 'Полная информация об участии в конкурсе',

    // FAQ
    'faq.title': 'Часто задаваемые вопросы',
    'faq.subtitle': 'Ответы на основные вопросы участников',

    // Biography
    'bio.title': 'Камолиддин Бехзод',
    'bio.subtitle': 'Величайший мастер восточной миниатюры',
    'bio.intro': 'Камолиддин Бехзод (ок. 1455–1535) — выдающийся художник-миниатюрист, чьё творчество оказало глубочайшее влияние на развитие искусства Центральной Азии и Ирана. Его работы отличаются невероятной детализацией, изысканной цветовой палитрой и глубоким гуманизмом.',

    // Contacts
    'contacts.title': 'Контакты',
    'contacts.subtitle': 'Свяжитесь с организаторами конкурса',
    'contacts.email': 'Электронная почта',
    'contacts.phone': 'Телефон',
    'contacts.address': 'Адрес',

    // Footer
    'footer.rights': 'Все права защищены',
    'footer.organizer': 'Организатор конкурса',

    // Common
    'common.learnMore': 'Узнать больше',
    'common.submit': 'Отправить',
    'common.back': 'Назад',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.nominations': 'Nominations',
    'nav.rules': 'Rules',
    'nav.faq': 'FAQ',
    'nav.biography': 'Kamoliddin Behzod',
    'nav.contacts': 'Contacts',
    'nav.login': 'Sign In',
    'nav.register': 'Register',

    'hero.title': 'International Creative Competition',
    'hero.subtitle': 'named after Kamoliddin Behzod',
    'hero.description': 'An annual international competition uniting artists from around the world in honor of the great master of Eastern miniature painting',
    'hero.cta': 'Submit Application',
    'hero.learnMore': 'Learn More',
    'hero.deadline': 'Submissions open until',

    'about.title': 'About the Competition',
    'about.subtitle': 'Tradition and modernity in creative dialogue',
    'about.description': 'The International Creative Competition named after Kamoliddin Behzod is an annual event aimed at preserving and developing the cultural heritage of the great master of Eastern miniature painting. The competition unites artists, designers, and architects aged 18 to 40 from around the world.',
    'about.stage1.title': 'Stage 1: Online Selection',
    'about.stage1.description': 'Online submission and jury evaluation',
    'about.stage2.title': 'Stage 2: Finals',
    'about.stage2.description': 'Offline exhibition and award ceremony',
    'about.age': '18–40 years',
    'about.geography': 'International participation',
    'about.format': 'Annual competition',

    'nominations.title': 'Nominations',
    'nominations.subtitle': 'Seven directions of creative expression',
    'nominations.apply': 'Apply Now',
    'nominations.details': 'Learn More',
    'nominations.deadline': 'Submission Deadline',
    'nominations.age': 'Age: 18–40 years',
    'nominations.international': 'International participation',

    'nom.1.title': 'Contemporary Interpretations in Fine Art',
    'nom.1.desc': 'Painting, graphics, and mixed media with elements of reimagining classical traditions of Eastern miniature',
    'nom.2.title': 'Decorative and Applied Arts',
    'nom.2.desc': 'Ceramics, textiles, jewelry, carving, and other forms of applied art',
    'nom.3.title': 'Illustration and Book Graphics',
    'nom.3.desc': 'Book illustration, graphic novels, and visual storytelling',
    'nom.4.title': 'Digital Art and Multimedia',
    'nom.4.desc': '3D modeling, animation, video art, interactive installations, and AR/VR',
    'nom.5.title': 'Graphic Design',
    'nom.5.desc': 'Brand identity, poster, packaging, typography, and visual communications',
    'nom.6.title': 'Architectural Design',
    'nom.6.desc': 'Interior and exterior design with elements of traditional architecture',
    'nom.7.title': 'Fashion and Accessory Modeling',
    'nom.7.desc': 'Fashion design, textile design, and accessories with cultural motifs',

    'rules.title': 'Rules & Regulations',
    'rules.subtitle': 'Complete information about competition participation',

    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to common participant questions',

    'bio.title': 'Kamoliddin Behzod',
    'bio.subtitle': 'The Greatest Master of Eastern Miniature Painting',
    'bio.intro': 'Kamoliddin Behzod (c. 1455–1535) was an outstanding miniature painter whose work profoundly influenced the development of art in Central Asia and Iran. His works are distinguished by incredible detail, exquisite color palette, and deep humanism.',

    'contacts.title': 'Contacts',
    'contacts.subtitle': 'Get in touch with the competition organizers',
    'contacts.email': 'Email',
    'contacts.phone': 'Phone',
    'contacts.address': 'Address',

    'footer.rights': 'All rights reserved',
    'footer.organizer': 'Competition Organizer',

    'common.learnMore': 'Learn More',
    'common.submit': 'Submit',
    'common.back': 'Back',
  },
} as const;

type TranslationKey = keyof typeof translations.ru;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ru');

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] || key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
