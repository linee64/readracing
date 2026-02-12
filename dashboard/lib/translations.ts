
export const translations = {
    English: {
        sidebar: {
            dashboard: 'Dashboard',
            my_books: 'My Books',
            library: 'Library',
            reading_plan: 'Reading Plan',
            ai_chat: 'AI Chat',
            leaderboard: 'Leaderboard',
            settings: 'Settings',
            sign_in: 'Sign In',
            logout: 'Logout',
            pro: 'Pro'
        },
        settings: {
            title: 'Settings',
            subtitle: 'Manage your preferences and account',
            profile_section: 'Profile Settings',
            display_name: 'Display Name',
            save_changes: 'Save Changes',
            saving: 'Saving...',
            email_address: 'Email Address',
            read_only: 'Read Only',
            min: 'min',
            app_preferences: 'App Preferences',
            notifications: 'Notifications',
            notifications_desc: 'Receive updates about your reading progress',
            reading_goal: 'Daily Reading Goal',
            reading_goal_desc: 'Set your daily reading target',
            app_language: 'App Language',
            language_desc: 'Preferred language for the interface',
            subscription: 'Subscription',
            plan_active: 'Active',
            plan_free: 'Free',
            billing: 'Billing',
            annual: 'Annual',
            next_payment: 'Next Payment',
            upgrade: 'Upgrade to Pro',
            manage_sub: 'Manage Subscription'
        },
        leaderboard: {
            title: 'Global Leaderboard',
            subtitle: 'Celebrate the most dedicated readers in the community.',
            top_readers: 'Top Readers',
            standings: 'Global Standings • This Week',
            rank: 'Rank',
            reader: 'Reader',
            progress: 'Progress',
            pages_read: 'Pages Read',
            view_full: 'View Full Global Board',
            joined: 'Joined',
            joined_recently: 'Joined recently',
            pages_away: 'pages away from overtaking',
            leading_pack: "You're leading the pack! Keep reading to maintain your lead.",
            keep_reading: 'Keep reading to climb the leaderboard!',
            doing_great: "You're doing great,",
            share_progress: 'Share Progress',
            timeframes: {
                weekly: 'Weekly',
                monthly: 'Monthly',
                all_time: 'All Time'
            }
        },
        library: {
            search_placeholder: 'Search books by title, author, genre...',
            all_genres: 'All Genres',
            all_languages: 'All Languages',
            reset: 'Reset',
            popular: 'Popular:',
            continue_reading: 'Continue Reading',
            ask_ai: 'Ask AI Assistant'
        }
    },
    Russian: {
        sidebar: {
            dashboard: 'Дашборд',
            my_books: 'Мои книги',
            library: 'Библиотека',
            reading_plan: 'План чтения',
            ai_chat: 'AI Чат',
            leaderboard: 'Рейтинг',
            settings: 'Настройки',
            sign_in: 'Войти',
            logout: 'Выйти',
            pro: 'PRO'
        },
        settings: {
            title: 'Настройки',
            subtitle: 'Управление предпочтениями и аккаунтом',
            profile_section: 'Настройки профиля',
            display_name: 'Отображаемое имя',
            save_changes: 'Сохранить',
            saving: 'Сохранение...',
            email_address: 'Email адрес',
            read_only: 'Только чтение',
            min: 'мин',
            app_preferences: 'Настройки приложения',
            notifications: 'Уведомления',
            notifications_desc: 'Получать обновления о прогрессе чтения',
            reading_goal: 'Дневная цель',
            reading_goal_desc: 'Установите вашу ежедневную цель чтения',
            app_language: 'Язык приложения',
            language_desc: 'Предпочитаемый язык интерфейса',
            subscription: 'Подписка',
            plan_active: 'Активна',
            plan_free: 'Бесплатная',
            billing: 'Оплата',
            annual: 'Ежегодно',
            next_payment: 'Следующий платеж',
            upgrade: 'Улучшить до Pro',
            manage_sub: 'Управление подпиской'
        },
        leaderboard: {
            title: 'Глобальный рейтинг',
            subtitle: 'Отмечаем самых преданных читателей сообщества.',
            top_readers: 'Топ читателей',
            standings: 'Общий зачет • Эта неделя',
            rank: 'Место',
            reader: 'Читатель',
            progress: 'Прогресс',
            pages_read: 'Прочитано страниц',
            view_full: 'Посмотреть весь рейтинг',
            joined: 'Присоединился',
            joined_recently: 'Недавно',
            pages_away: 'страниц до обгона',
            leading_pack: "Вы лидируете! Продолжайте читать, чтобы сохранить лидерство.",
            keep_reading: 'Продолжайте читать, чтобы подняться в рейтинге!',
            doing_great: "Отличная работа,",
            share_progress: 'Поделиться прогрессом',
            timeframes: {
                weekly: 'Неделя',
                monthly: 'Месяц',
                all_time: 'Все время'
            }
        },
        library: {
            search_placeholder: 'Поиск книг по названию, автору, жанру...',
            all_genres: 'Все жанры',
            all_languages: 'Все языки',
            reset: 'Сброс',
            popular: 'Популярное:',
            continue_reading: 'Читать далее',
            ask_ai: 'Спросить AI'
        }
    }
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.English;
