// i18n.tsx
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


    // Auth
    'auth.hero.loginTitle': 'Вход в личный кабинет',
    'auth.hero.registerTitle': 'Регистрация участника',
    'auth.hero.subtitle': 'Управляйте профилем и подавайте заявки на участие в конкурсе',

    'auth.login': 'Вход',
    'auth.register': 'Регистрация',

    'auth.firstName': 'Имя',
    'auth.lastName': 'Фамилия',
    'auth.email': 'Email',
    'auth.password': 'Пароль',

    'auth.loading': 'Обработка...',
    'auth.error': 'Ошибка авторизации',


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

    // Profile
    'profile.hero.title': 'Личный кабинет',
    'profile.hero.subtitle': 'Управление профилем и заявками',

    'profile.tabs.profile': 'Профиль',
    'profile.tabs.applications': 'Мои заявки',
    'profile.tabs.diplomas': 'Дипломы',

    'profile.loading': 'Загрузка профиля...',
    'profile.error.load': 'Ошибка загрузки данных',

    'profile.section.personal': 'Личная информация',
    'profile.section.contacts': 'Контактные данные',

    'profile.field.firstName': 'Имя',
    'profile.field.lastName': 'Фамилия',
    'profile.field.age': 'Возраст',
    'profile.field.city': 'Город',
    'profile.field.phone': 'Телефон',
    'profile.field.email': 'Email',

    'profile.edit': 'Редактировать профиль',
    'profile.save': 'Сохранить изменения',
    'profile.saving': 'Сохранение...',
    'profile.success': 'Профиль успешно обновлён',
    'profile.saveError': 'Ошибка сохранения',

    'profile.applications.empty': 'У вас пока нет заявок.',
    'profile.applications.status': 'Статус',

    'profile.diplomas.title': 'Мои дипломы',
    'profile.diplomas.download': 'Скачать',

    // Password
    'profile.password.title': 'Смена пароля',
    'profile.password.current': 'Текущий пароль',
    'profile.password.new': 'Новый пароль',
    'profile.password.confirm': 'Повторите пароль',
    'profile.password.update': 'Обновить пароль',
    'profile.password.success': 'Пароль успешно изменён',
    'profile.password.error': 'Ошибка смены пароля',
    
    'profile.logout': 'Выйти',
    // FORM
    'profile.form.title': 'Подача заявки',
    'profile.form.field.fullName': 'ФИО участника',
    'profile.form.field.education': 'Учебное заведение и факультет',
    'profile.form.field.drive': 'Ссылка на Google Drive (необязательно)',
    'profile.form.field.description': 'Описание работы (необязательно)',

    'profile.form.upload': 'Загрузить работы',
    'profile.form.maxFiles': 'до 10 файлов',

    'profile.form.submit': 'Подать заявку',
    'profile.form.sending': 'Отправка...',

    'profile.form.error.loadNominations': 'Ошибка загрузки номинаций',
    'profile.form.error.noNomination': 'Выберите номинацию',
    'profile.form.error.noWorks': 'Загрузите хотя бы одну работу',
    'profile.form.error.submit': 'Ошибка отправки',

    'profile.form.success.title': 'Заявка отправлена',
    'profile.form.success.subtitle': 'Ваша работа успешно отправлена на рассмотрение жюри.',
  
    // jury panel
    'jury.title': 'Панель жюри',
    'jury.subtitle': 'Оценка работ конкурса',

    'jury.dashboard': 'Панель',
    'jury.submissions': 'Заявки',
    'jury.myReviews': 'Мои оценки',
    'jury.review': 'Оценить',

    'jury.totalSubmissions': 'Всего заявок',
    'jury.reviewed': 'Оценено',
    'jury.pending': 'Ожидают оценки',
    'jury.averageScore': 'Средний балл',

    'jury.loadingDashboard': 'Загрузка панели...',
    'jury.loading': 'Загрузка...',

    'jury.noSubmissions': 'Заявок пока нет',
    'jury.failedSubmissions': 'Ошибка загрузки заявок',

    'jury.reviewSubmission': 'Оценка работы',
    'jury.score': 'Баллы',
    'jury.comment': 'Комментарий',

    'jury.submitReview': 'Отправить оценку',
    'jury.saving': 'Сохранение...',

    'jury.reviewSaved': 'Оценка сохранена',
    'jury.reviewError': 'Ошибка сохранения оценки',

    'jury.backProfile': 'Назад в профиль',

    'jury.nomination': 'Номинация',
    'jury.submissionWork': 'Работа участника',

    // admin panel
    'admin.logs.title': 'Системные логи',
    'admin.logs.user': 'Пользователь',
    'admin.logs.action': 'Действие',
    'admin.logs.target': 'Объект',
    'admin.logs.meta': 'Данные',
    'admin.logs.date': 'Дата',

    'admin.logs.filter.action': 'Действие...',
    'admin.logs.filter.user': 'ID пользователя...',

    'admin.pagination.page': 'Страница',
    'admin.pagination.of': 'из',

    'admin.prev': 'Назад',
    'admin.next': 'Далее',
    'admin.system': 'Система',

    // admin sidebar
    'admin.sidebar.title': 'Панель администратора',
    'admin.sidebar.subtitle': 'Система управления',
    'admin.sidebar.dashboard': 'Панель',
    'admin.sidebar.users': 'Пользователи',
    'admin.sidebar.submissions': 'Заявки',
    'admin.sidebar.logs': 'Логи',
    'admin.sidebar.contest': 'Настройки конкурса',
    'admin.sidebar.footer': 'Админ панель',

    // dashboard
    'admin.dashboard.title': 'Панель',
    'admin.dashboard.phase': 'Фаза',

    'admin.stats.totalUsers': 'Всего пользователей',
    'admin.stats.juryMembers': 'Жюри',
    'admin.stats.totalSubmissions': 'Всего заявок',
    'admin.stats.pending': 'Ожидают',
    'admin.stats.approved': 'Одобрены',
    'admin.stats.rejected': 'Отклонены',
    'admin.stats.nominations': 'Номинации',
    'admin.stats.totalEvaluations': 'Всего оценок',
    'admin.stats.averageScore': 'Средний балл',

    // users
    'admin.users.title': 'Пользователи',
    'admin.users.name': 'Имя',
    'admin.users.email': 'Email',
    'admin.users.role': 'Роль',
    'admin.users.status': 'Статус',
    'admin.users.actions': 'Действия',
    'admin.users.allRoles': 'Все роли',
    'admin.users.participant': 'Участник',
    'admin.users.jury': 'Жюри',
    'admin.users.admin': 'Администратор',
    'admin.users.active': 'Активен',
    'admin.users.disabled': 'Отключён',
    'admin.users.activate': 'Активировать',
    'admin.users.deactivate': 'Деактивировать',

    // contest
    'admin.contest.title': 'Настройки конкурса',
    'admin.contest.phase': 'Фаза конкурса',
    'admin.contest.submission': 'Приём заявок',
    'admin.contest.evaluation': 'Оценивание',
    'admin.contest.finished': 'Завершён',
    'admin.contest.deadlines': 'Дедлайны',
    'admin.contest.submissionDeadline': 'Дедлайн подачи',
    'admin.contest.evaluationDeadline': 'Дедлайн оценки',
    'admin.contest.save': 'Сохранить',
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


    // Auth
    'auth.hero.loginTitle': 'Sign in to your account',
    'auth.hero.registerTitle': 'Participant registration',
    'auth.hero.subtitle': 'Manage your profile and submit competition applications',

    'auth.login': 'Sign In',
    'auth.register': 'Register',

    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.email': 'Email',
    'auth.password': 'Password',

    'auth.loading': 'Processing...',
    'auth.error': 'Authorization error',



    'profile.hero.title': 'Profile',
    'profile.hero.subtitle': 'Manage your profile and submissions',

    'profile.tabs.profile': 'Profile',
    'profile.tabs.applications': 'My Applications',
    'profile.tabs.diplomas': 'Diplomas',

    'profile.loading': 'Loading profile...',
    'profile.error.load': 'Failed to load data',

    'profile.section.personal': 'Personal Information',
    'profile.section.contacts': 'Contact Information',

    'profile.field.firstName': 'First Name',
    'profile.field.lastName': 'Last Name',
    'profile.field.age': 'Age',
    'profile.field.city': 'City',
    'profile.field.phone': 'Phone',
    'profile.field.email': 'Email',

    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.success': 'Profile updated successfully',
    'profile.saveError': 'Save failed',

    'profile.applications.empty': 'You have no applications yet.',
    'profile.applications.status': 'Status',

    'profile.diplomas.title': 'My Diplomas',
    'profile.diplomas.download': 'Download',

    'profile.password.title': 'Change Password',
    'profile.password.current': 'Current Password',
    'profile.password.new': 'New Password',
    'profile.password.confirm': 'Confirm Password',
    'profile.password.update': 'Update Password',
    'profile.password.success': 'Password updated successfully',
    'profile.password.error': 'Password update failed',


    'profile.logout': 'Logout',

    'profile.form.title': 'Submit Application',
    'profile.form.field.fullName': 'Full Name',
    'profile.form.field.education': 'Educational Institution and Faculty',
    'profile.form.field.drive': 'Google Drive link (optional)',
    'profile.form.field.description': 'Work description (optional)',

    'profile.form.upload': 'Upload works',
    'profile.form.maxFiles': 'up to 10 files',

    'profile.form.submit': 'Submit Application',
    'profile.form.sending': 'Submitting...',

    'profile.form.error.loadNominations': 'Failed to load nominations',
    'profile.form.error.noNomination': 'Select a nomination',
    'profile.form.error.noWorks': 'Upload at least one work',
    'profile.form.error.submit': 'Submission error',

    'profile.form.success.title': 'Application Submitted',
    'profile.form.success.subtitle': 'Your work has been successfully submitted for jury review.',
  
    // jury panel
    'jury.title': 'Jury Panel',
    'jury.subtitle': 'Contest evaluation',

    'jury.dashboard': 'Dashboard',
    'jury.submissions': 'Submissions',
    'jury.myReviews': 'My Reviews',
    'jury.review': 'Review',

    'jury.totalSubmissions': 'Total Submissions',
    'jury.reviewed': 'Reviewed',
    'jury.pending': 'Pending',
    'jury.averageScore': 'Average Score',

    'jury.loadingDashboard': 'Loading dashboard...',
    'jury.loading': 'Loading...',

    'jury.noSubmissions': 'No submissions yet',
    'jury.failedSubmissions': 'Failed to load submissions',

    'jury.reviewSubmission': 'Review submission',
    'jury.score': 'Score',
    'jury.comment': 'Comment',

    'jury.submitReview': 'Submit review',
    'jury.saving': 'Saving...',

    'jury.reviewSaved': 'Review saved',
    'jury.reviewError': 'Failed to save review',

    'jury.backProfile': 'Back to profile',

    'jury.nomination': 'Nomination',
    'jury.submissionWork': 'Submission work',

    // admin panel
    'admin.logs.title': 'System Logs',
    'admin.logs.user': 'User',
    'admin.logs.action': 'Action',
    'admin.logs.target': 'Target',
    'admin.logs.meta': 'Meta',
    'admin.logs.date': 'Date',

    'admin.logs.filter.action': 'Action...',
    'admin.logs.filter.user': 'User ID...',

    'admin.pagination.page': 'Page',
    'admin.pagination.of': 'of',

    'admin.prev': 'Prev',
    'admin.next': 'Next',
    'admin.system': 'System',


    // admin sidebar
    'admin.sidebar.title': 'Admin Panel',
    'admin.sidebar.subtitle': 'Management System',
    'admin.sidebar.dashboard': 'Dashboard',
    'admin.sidebar.users': 'Users',
    'admin.sidebar.submissions': 'Submissions',
    'admin.sidebar.logs': 'Logs',
    'admin.sidebar.contest': 'Contest Settings',
    'admin.sidebar.footer': 'Admin System',

    // dashboard
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.phase': 'Phase',

    'admin.stats.totalUsers': 'Total Users',
    'admin.stats.juryMembers': 'Jury Members',
    'admin.stats.totalSubmissions': 'Total Submissions',
    'admin.stats.pending': 'Pending',
    'admin.stats.approved': 'Approved',
    'admin.stats.rejected': 'Rejected',
    'admin.stats.nominations': 'Nominations',
    'admin.stats.totalEvaluations': 'Total Evaluations',
    'admin.stats.averageScore': 'Average Score',

    // users
    'admin.users.title': 'Users',
    'admin.users.name': 'Name',
    'admin.users.email': 'Email',
    'admin.users.role': 'Role',
    'admin.users.status': 'Status',
    'admin.users.actions': 'Actions',
    'admin.users.allRoles': 'All Roles',
    'admin.users.participant': 'Participant',
    'admin.users.jury': 'Jury',
    'admin.users.admin': 'Admin',
    'admin.users.active': 'Active',
    'admin.users.disabled': 'Disabled',
    'admin.users.activate': 'Activate',
    'admin.users.deactivate': 'Deactivate',

    // contest
    'admin.contest.title': 'Contest Settings',
    'admin.contest.phase': 'Contest Phase',
    'admin.contest.submission': 'Submission',
    'admin.contest.evaluation': 'Evaluation',
    'admin.contest.finished': 'Finished',
    'admin.contest.deadlines': 'Deadlines',
    'admin.contest.submissionDeadline': 'Submission Deadline',
    'admin.contest.evaluationDeadline': 'Evaluation Deadline',
    'admin.contest.save': 'Save',
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
