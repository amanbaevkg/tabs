# BCC web: финальный технический план (v2)

Статус: **план под ваши финальные решения**. Основа — утверждённый макет Concept 1 и hero-видео «черновик 9».
Живой сайт businesscentercapellen.lu не трогаем. Вся работа идёт в local → staging → test.

Что изменилось по сравнению с v1:
- языки: `/en /fr /de /lu`, выпадающий селектор;
- переводы FR/DE/LU делаю я;
- заменяемый email-слой без финального SMTP;
- хостинг не привязан к провайдеру;
- отдельный GitLab-репозиторий `bcc-web`;
- юридические страницы пока с заглушками;
- CMS нужна сразу.

---

## 1. Final stack

| Слой | Выбор |
|---|---|
| Framework | **Next.js 15 (App Router)**, React 19, **TypeScript strict** |
| Рендеринг | React Server Components + статическая генерация (SSG) всех страниц и языков; обновление по вебхуку CMS (on-demand revalidation) |
| Стили | **CSS Modules + дизайн-токены** (CSS custom properties), `clamp()`, container queries. Без Tailwind: точнее переносит макет. |
| Анимации | CSS + IntersectionObserver; **Motion** (Framer Motion) точечно и лениво. GSAP не нужен (см. раздел 8 v1: объём и INP). |
| i18n | **next-intl** (одна система для всех языков, локализованные URL) |
| CMS | **Sanity** (обоснование в разделе 5) |
| Формы | React Hook Form + **Zod** (одна схема на клиенте и сервере) |
| Email | Интерфейс `EmailProvider` с адаптерами: **SMTP (Nodemailer)**, **Resend**, **Postmark**, `log` (для dev и staging) |
| Анти-спам | Cloudflare Turnstile + honeypot + проверка времени заполнения + rate limit |
| Rate limit | Интерфейс `RateLimiter`: **Upstash Redis** (serverless) / Redis (свой сервер) / in-memory (только dev) |
| Изображения | Sanity Image CDN (AVIF/WebP, crop, hotspot) через `next/image` с кастомным loader'ом |
| Видео | Файлы в нескольких разрешениях (MP4 H.264 + WebM VP9) + постер; хранение в Sanity (или позже Mux) |
| Шрифты | `next/font/local` (Archivo, Newsreader, IBM Plex Mono), subset latin + latin-ext |
| Качество | ESLint, Prettier, Vitest, Testing Library, **Playwright** (e2e и визуальные снимки на 8 ширинах), **axe**, Lighthouse CI |
| Инфраструктура | pnpm workspaces, Node 22 LTS, **GitLab CI** |

---

## 2. Структура проекта

Монорепозиторий pnpm: сайт и CMS-студия живут отдельно, но делят типы и конфиги.

```
bcc-web/
├── apps/
│   ├── web/                         # Next.js-сайт
│   │   ├── src/app/
│   │   │   ├── [locale]/            # en | fr | de | lu
│   │   │   │   ├── layout.tsx       # <html lang>, шрифты, Header/Footer, SkipLink
│   │   │   │   ├── page.tsx         # Home
│   │   │   │   ├── [...slug]/page.tsx   # гибкие страницы из CMS (About Us и будущие)
│   │   │   │   ├── services/[slug]/page.tsx
│   │   │   │   ├── news/page.tsx, news/[slug]/page.tsx
│   │   │   │   ├── contact/page.tsx
│   │   │   │   ├── legal/[slug]/page.tsx    # privacy-policy, legal-notice
│   │   │   │   └── not-found.tsx
│   │   │   ├── api/
│   │   │   │   ├── contact/route.ts         # приём заявок
│   │   │   │   └── revalidate/route.ts      # вебхук Sanity (подписанный)
│   │   │   ├── sitemap.ts, robots.ts, manifest.ts
│   │   │   └── [locale]/opengraph-image.tsx
│   │   ├── src/components/
│   │   │   ├── layout/    Header, MobileNav, LanguageSelect, Footer, SkipLink
│   │   │   ├── sections/  Hero, WorkspaceFinder, ServicesGrid, OfferFeature,
│   │   │   │              LogoCarousel, ImageBanner, SpacesGallery, CtaBand,
│   │   │   │              Testimonials, NewsList, ContactSection, LocationMap
│   │   │   ├── forms/     ContactForm, fields/*, Turnstile
│   │   │   ├── media/     HeroVideo, CmsImage, ClickToLoadMap
│   │   │   └── ui/        Button, TextLink, Container, Section, Heading, Eyebrow,
│   │   │                  Icon, Listbox, Carousel, Pagination, Toast, VisuallyHidden
│   │   ├── src/lib/
│   │   │   ├── cms/       client, запросы GROQ, типы (typegen), fallback-данные
│   │   │   ├── i18n/      routing, pathnames, hreflang-маппинг (lu → lb)
│   │   │   ├── seo/       metadata builder, JSON-LD
│   │   │   ├── email/     EmailProvider + адаптеры smtp/resend/postmark/log
│   │   │   ├── security/  rateLimit, turnstile, origin, sanitize, headers (CSP)
│   │   │   ├── validation/ Zod-схемы форм
│   │   │   └── env.ts     валидация переменных (server-only)
│   │   ├── src/styles/    tokens.css, base.css, utilities.css
│   │   ├── messages/      en.json fr.json de.json lu.json   (UI-строки)
│   │   ├── public/        favicon, fallback-медиа
│   │   ├── middleware.ts  язык, CSP nonce, закрытие staging
│   │   └── next.config.ts security headers, redirects, images
│   └── studio/                      # Sanity Studio (админка)
│       ├── schemas/  documents/, objects/, singletons/
│       ├── structure/ удобное меню для редактора
│       └── sanity.config.ts
├── packages/
│   ├── config/        eslint, tsconfig, prettier (общие)
│   └── content-types/ сгенерированные типы контента (web и studio)
├── docs/              архитектура, как добавить страницу/язык/услугу/форму, деплой, CMS-гайд
├── translations/      glossary.md, review-notes.md (метки для проверки перевода)
├── .gitlab-ci.yml
├── .env.example       все переменные без значений
├── .gitignore         .env*, node_modules, .next, coverage, секреты
├── Dockerfile, docker-compose.yml (свой Node-сервер)
├── netlify.toml, vercel.json (минимальные)
└── README.md
```

---

## 3. Routing strategy

- **URL с префиксом языка у всех:** `/en/…`, `/fr/…`, `/de/…`, `/lu/…`. В URL `lu`, как вы просили. В `hreflang` и `<html lang>` ставим стандартный код **`lb`**: так Google и скринридеры правильно распознают люксембургский.
- **Корень `/`:** 307 на язык из cookie или `Accept-Language`, по умолчанию **`/en/`**. `x-default` указывает на `/en/`.
- **Локализованные адреса страниц** задаются в CMS (slug по языкам) и в конфиге next-intl для системных страниц:

  | EN | FR | DE | LU |
  |---|---|---|---|
  | `/en/about-us` | `/fr/a-propos` | `/de/ueber-uns` | `/lu/iwwer-eis` |
  | `/en/contact` | `/fr/contact` | `/de/kontakt` | `/lu/kontakt` |

  Люксембургские slug'и помечу для проверки.
- **Страницы:**
  - Home;
  - гибкие CMS-страницы (About Us и будущие);
  - `services/[slug]`;
  - `news` с пагинацией и `news/[slug]`;
  - `contact`;
  - `legal/privacy-policy`, `legal/legal-notice`;
  - 404.
- **Старые адреса живого сайта:** 301 с `/about-us/` на `/en/about-us`, с `/contact/` на `/en/contact` (срабатывает только после переключения домена).
- **API:**
  - `POST /api/contact` — only same-origin;
  - `POST /api/revalidate` — только с подписью Sanity.

---

## 4. Component architecture

- **Данные → секция → UI.** Страница получает данные из `lib/cms`, приводит их к типам и передаёт в секции. Секции собраны из `ui/*`. Тексты и медиа никогда не зашиты в компоненты.
- **Серверные по умолчанию.** Клиентские только: `Header` (скролл), `MobileNav`, `LanguageSelect`, `HeroVideo`, `WorkspaceFinder`, `SpacesGallery`, `ContactForm`, `ClickToLoadMap`.
- **Устойчивость к количеству контента** (ваше требование «5 / 20 / 50»):

  | Компонент | Поведение |
  |---|---|
  | `LogoCarousel` | От 1 до N логотипов. При малом количестве (≤ 5) статичный ряд по центру, при большем бесконечная лента; скорость рассчитывается от количества, чтобы темп был одинаковый. Логотипы нормализуются по высоте. |
  | `ServicesGrid` | CSS Grid `auto-fit, minmax(…)`: 1, 2, 3 или 4 колонки сами. Одна услуга — широкая карточка, нечётный остаток выравнивается. |
  | `SpacesGallery` | Любое количество фото, scroll-snap. Шаблон размеров повторяется (узор макета), счётчик и прогресс считаются автоматически. |
  | `NewsList` | Пагинация на сервере (например, 9 на страницу) плюс «Load more» для удобства; SEO-страницы `?page=2`. |
  | `Testimonials` | 1 отзыв — крупная цитата, 2–4 — текущая раскладка, больше — карусель. |
  | Тексты | Нет фиксированных высот, `min-height` вместо `height`; длинные заголовки переносятся (`text-wrap: balance`, `hyphens` для DE/LU). |
  | Необязательные поля | Нет картинки — секция перестраивается в текстовый вариант. Нет CTA — кнопка не рендерится. Пустой список — секция не выводится вовсе, без пустых отступов. |

- Каждая секция экспортирует тип входных данных и имеет «пустой» и «максимальный» варианты в тестах (Playwright-снимки), чтобы поломки от объёма контента ловились автоматически.

---

## 5. CMS: выбор

| | **Sanity** | **Strapi** | **Directus** |
|---|---|---|---|
| Модель | SaaS (хранилище контента и CDN у Sanity), Studio — React-приложение в вашем репозитории | Self-hosted Node + SQL-база | Self-hosted, надстройка над SQL-базой |
| Нужен свой сервер | **Нет** | Да (сервер, БД, бэкапы, обновления) | Да (сервер, БД, бэкапы, обновления) |
| Схема контента | **В коде (TypeScript, Git, code review)** | В коде и через админку | В основном через админку и БД |
| Валидация полей | Очень гибкая (обязательность, длины, кастомные правила, предупреждения) | Хорошая | Хорошая |
| Изображения | **Встроенный Image CDN: AVIF/WebP, crop, hotspot**, размеры по запросу | Нужен провайдер (S3/Cloudinary) и своя обработка | Встроенные трансформации, но на вашем сервере |
| i18n | Плагины (поле- и документ-уровень) | Встроенный i18n-плагин | Через translations-связи |
| Превью и черновики | Draft mode, Presentation (визуальное редактирование) | Есть, настраивается | Есть, настраивается |
| Безопасность / поддержка | Сервер и патчи на стороне Sanity; у вас только токены | Вы отвечаете за патчи, БД, бэкапы, доступ к админке | То же, что у Strapi |
| Стоимость | Бесплатный тариф может хватить; за роли и больше пользователей нужен платный | Софт бесплатный, платите за сервер и обслуживание | Бесплатно при малой выручке компании (лицензия BSL: для крупных организаций платно) |
| Минусы | Зависимость от вендора; данные вне вашей инфраструктуры (нужно проверить условия хранения и DPA для GDPR); GROQ — свой язык запросов | Больше инфраструктуры и зон риска | Больше инфраструктуры; лицензия |

**Рекомендую Sanity.** Причины:
1. **Не нужен ещё один сервер.** Это соответствует принципу «backend только там, где нужен», меньше поверхности атаки и меньше обслуживания.
2. **Схемы в коде.** CMS управляет только контентом: редактор физически не может менять раскладку, отступы или анимации.
3. **Встроенный Image CDN с hotspot.** Редактор указывает главную точку кадра, и фото правильно режется под каждую ширину. Это важно для адаптива.
4. **Лучшая связка с Next.js:** typegen, draft mode, визуальное превью, вебхуки для обновления.

**Что нужно от вас:** создать проект Sanity (бесплатно) на корпоративный аккаунт и проверить условия хранения данных и DPA (GDPR). Пока проекта нет, сайт работает на **встроенных fallback-данных** из репозитория, так что разработка не блокируется.

---

## 6. CMS content models

Общие правила:
- у каждого поля есть подсказка для редактора (размер, пропорции, лимит);
- обязательные поля помечены;
- у текстов лимит длины, у изображений минимальные размеры и обязательный alt.

**Singletons (по одному документу):**

- **`siteSettings`**
  - название, логотип;
  - контакты: телефон, email, адрес;
  - часы работы (список «дни + время»);
  - соцсети (тип + URL, валидация `https://`);
  - SEO по умолчанию, OG-картинка по умолчанию (1200×630).
- **`homePage`** — фиксированный порядок секций (дизайн в коде), редактируется только содержимое:
  - hero: заголовок ≤ 60, подзаголовок ≤ 120; видео: файлы 1080/720/480 + постер ≥ 1920×1080, 16:9, обязательный;
  - finder: список типов рабочих мест и размеров команды;
  - блоки Co-working и Private Offices: заголовок, текст ≤ 400, 1–2 фото с пропорциями;
  - ссылка на услуги;
  - «They trust us»: заголовок + ссылка на логотипы;
  - «Building tomorrow's now»: заголовок, подзаголовок, фото ≥ 2880×2000;
  - галерея «Our spaces»;
  - CTA;
  - отзывы (выбор или все);
  - финальный CTA + фото ≥ 2880×1720;
  - SEO.
- **`navigation`** — пункты меню (ссылка на документ или внешний URL), порядок, кнопка CTA.

**Документы (коллекции):**

- **`service`**
  - название ≤ 60, slug, краткое описание ≤ 200, основной текст (rich text), иконка из фиксированного набора, изображение;
  - порядок, показывать на главной (да/нет), SEO.
- **`space`** (фото галереи)
  - изображение ≥ 1600 px, alt (обязателен), подпись ≤ 60;
  - категория (офис, переговорная, кухня…), порядок.
- **`testimonial`**
  - цитата ≤ 500, имя, должность, компания, рейтинг 1–5;
  - язык оригинала, порядок.
- **`clientLogo`**
  - название, логотип (SVG или PNG с прозрачностью, ≥ 400 px по ширине);
  - ссылка (необязательно), порядок, активен (да/нет).
- **`newsPost`**
  - заголовок ≤ 100, slug, дата, обложка ≥ 1600×900 (16:9), анонс ≤ 250, rich text, автор;
  - SEO; статус «черновик / опубликовано».
- **`page`** (гибкие страницы: About Us и будущие)
  - заголовок, slug;
  - **конструктор из разрешённых секций** (текст, текст + фото, сетка услуг, галерея, CTA, FAQ): редактор выбирает, какие секции и в каком порядке, но не их вид;
  - SEO.
- **`legalPage`**
  - заголовок, slug, rich text, дата обновления;
  - флаг **«утверждено юристом»**: без него production-сборка остановится (см. раздел 15).

**Объекты:**
- `seo`: title ≤ 60, description ≤ 160, OG-картинка, noindex;
- `link`: внутренняя или внешняя ссылка;
- `imageWithAlt`: изображение + обязательный alt + hotspot;
- `video`: файлы, постер, длительность;
- `cta`: текст ≤ 30 + ссылка.

**Языки в CMS:**
- **документ-уровень** (отдельный документ на язык, связанные между собой) для `page`, `newsPost`, `legalPage`, `service`: у длинных текстов разная структура;
- **поле-уровень** (EN/FR/DE/LU рядом) для коротких полей: `siteSettings`, `homePage`, `testimonial`, подписи в галерее.

Если перевода нет, на сайте показывается EN, а редактор видит предупреждение «перевод отсутствует».

**Роли и права:**
- **Administrator** — всё, включая схемы и пользователей;
- **Editor** — контент на всех языках, публикация;
- **Translator** (если тариф позволяет) — только переводы, без публикации.

Доступ в Studio только по приглашению, желательно с SSO или 2FA корпоративного аккаунта.

---

## 7. Responsive breakpoints

| Токен | Ширина | Устройства |
|---|---|---|
| `xs` | < 380 | маленькие телефоны |
| `sm` | 380–599 | обычные и большие телефоны |
| `md` | 600–899 | планшет портрет |
| `lg` | 900–1199 | планшет ландшафт, маленькие ноутбуки |
| `xl` | 1200–1535 | ноутбуки, десктоп (макет 1440) |
| `2xl` | ≥ 1536 | большие мониторы |

Раскладка каждого блока по ширинам (header, навигация, language selector, hero-видео, finder, типографика, услуги, галереи, логотипы, отзывы, формы, footer) — как в плане v1, раздел 5. Добавлено:

- **Language selector:**
  - на `lg`+ компактная кнопка «EN ▾» с выпадающим списком (EN English, FR Français, DE Deutsch, LU Lëtzebuergesch), полностью с клавиатуры;
  - на `md` и ниже внутри мобильного меню, список из 4 пунктов.
- **Services:**
  - на `xl` 3–4 колонки;
  - на `lg` 3;
  - на `md` 2;
  - на `sm` и ниже 1.
- **Длинные слова в DE/LU** («Unternehmensdomizilierung») проверяются отдельно на `xs`/`sm`: `hyphens: auto` с правильным `lang`.

**Автоматическая проверка:** Playwright-снимки на ширинах 360, 390, 430, 768, 1024, 1280, 1440, 1920, **на всех 4 языках**, плюс проверка «нет горизонтального скролла» и «нет перекрытий» (пересечение ключевых блоков).

---

## 8. Security plan (реализация, не только список)

| Риск | Что реализуем |
|---|---|
| **XSS** | Экранирование React. Rich text из CMS рендерится через `@portabletext/react` с белым списком блоков (без сырого HTML). JSON-LD экранирует `<`. **CSP с nonce** (middleware): `default-src 'self'`, `script-src 'self' 'nonce-…' challenges.cloudflare.com`, `img-src 'self' cdn.sanity.io data:`, `media-src 'self' cdn.sanity.io`, `frame-src challenges.cloudflare.com` (+ Google Maps только после клика), `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`. |
| **CSRF** | API принимает только same-origin: проверка `Origin` и `Sec-Fetch-Site`, только `POST` с `application/json`; cookie-сессий у сайта нет. |
| **Injection** | Строгие Zod-схемы (`.strict()`, длины, форматы). GROQ-запросы только с параметрами, без склейки строк. **Email header injection:** запрет `\r\n` в имени, email и теме; получатель фиксирован в env. HTML-экранирование в шаблоне письма. |
| **Brute force / спам / боты** | Turnstile (проверка на сервере с `remoteip`), honeypot, минимум 3 с на заполнение, **rate limit 5 / 10 мин на IP + 100 / час глобально**, лимит тела запроса 16 КБ, одинаковые нейтральные ответы. |
| **Вредоносный ввод** | Нормализация Unicode, отсечение управляющих символов, ограничение длины, проверка email (формат + домен без пробелов), телефон по E.164-подобной маске. |
| **Загрузки файлов** | На сайте в v1 загрузок **нет**. В CMS загрузки только у авторизованных редакторов, в хранилище Sanity (не на наш сервер), с проверкой типов (изображения и видео). Будущие формы с файлами: белый список MIME, лимит размера, хранение вне веб-корня или в объектном хранилище, антивирусная проверка. |
| **Злоупотребление API** | Rate limit, лимит размера, только нужные методы (иначе 405), таймауты к внешним сервисам. Вебхук revalidate проверяет подпись Sanity (HMAC) и принимает только известные типы документов. |
| **Headers** | CSP, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (preload после проверки домена), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `COOP`, `X-Frame-Options: DENY`; `X-Powered-By` отключён. Проверка в CI тестом. |
| **HTTPS** | Редирект на HTTPS на всех хостингах (для своего Node-сервера конфиг Caddy или Nginx в репозитории). |
| **CORS** | Без `Access-Control-Allow-Origin` для API, чужие origin получают 403. Studio работает через CORS-настройки Sanity, только наши домены. |
| **Зависимости** | Lockfile; в GitLab CI: `pnpm audit --prod` (сборка падает на high/critical), **GitLab Dependency Scanning, SAST, Secret Detection**; Renovate с еженедельными MR. |
| **Secrets** | Только в переменных окружения хостинга и GitLab CI (masked + protected), отдельно для staging и production. `lib/env.ts` валидирует при старте и помечен `server-only`. В браузер только `NEXT_PUBLIC_*` (Turnstile site key, Sanity project ID, URL сайта). `.env*` в `.gitignore`, плюс pre-commit проверка на секреты (gitleaks). |
| **Логи** | Структурированные, без персональных данных: имя, email, телефон и текст сообщения не логируются; IP только в виде хеша для rate limit. Ошибки провайдера почты логируются без содержимого письма. |
| **GDPR** | Согласие в форме со ссылкой на Privacy Policy. Заявки не хранятся в базе, только письмо. Карта по клику. Аналитика только после согласия или cookieless. |
| **Staging** | Закрыт паролем, `X-Robots-Tag: noindex, nofollow`, `robots.txt: Disallow: /`, отдельный Sanity dataset `staging`, отдельные ключи. |

---

## 9. Performance plan

Бюджеты (мобильный, 4G):

| Метрика | Цель |
|---|---|
| LCP | < 2,0 с |
| CLS | < 0,05 |
| INP | < 200 мс |
| JS на главной | < 90 КБ gzip |
| Lighthouse Performance | ≥ 95 |

- **Изображения:** Sanity CDN + `next/image`: AVIF/WebP, `srcset`/`sizes`, hotspot-кроп под каждую раскладку, lazy для всего ниже первого экрана, `priority` только для постера hero, LQIP-плейсхолдер.
- **Hero-видео:**
  - LCP — постер;
  - видео подключается после `load` и в idle;
  - версии 1080p (~2,5 Мбит/с), 720p (~1,5), 480p (~0,8) в WebM и MP4, без звука;
  - на телефонах короткая петля;
  - не грузится при Save-Data, медленной сети и reduced motion;
  - пауза вне экрана;
  - кнопка паузы (доступность).
- **Шрифты:** self-hosted, subset, `swap`, preload только основного начертания, метрики fallback.
- **JS:** серверные компоненты; клиентские острова маленькие; `dynamic()` для галереи, формы, карты и Motion; Studio вынесена в отдельное приложение и в бандл сайта не попадает.
- **Кеш и CDN:** SSG всех страниц и языков; обновление по вебхуку CMS (только изменённые страницы); хешированные файлы `immutable`; видео и фото с долгим кешем; готово к любому CDN.
- **Сторонние скрипты:** по умолчанию нет. Turnstile только на странице контактов, карта по клику.
- **Контроль:** Lighthouse CI с бюджетами в каждом MR; сбор Web Vitals на staging.

---

## 10. i18n plan

- **Одна система:** next-intl; языки `en` (по умолчанию), `fr`, `de`, `lu`; для SEO `lu` → `lb`.
- **Где хранятся тексты:**
  - UI-строки (меню, кнопки, форма, ошибки): `messages/{locale}.json` с неймспейсами;
  - контент: в CMS (поле- или документ-уровень, см. раздел 6);
  - fallback-контент в репозитории — те же файлы по языкам.
- **Форматирование:** ICU (множественное число: «1 person / 2 persons», FR «1 personne / 2 personnes», DE «1 Person / 2 Personen»), даты, числа и телефоны по языку.
- **SEO:** `hreflang` на всех страницах + `x-default`, локализованные title, description и OG, sitemap с альтернативами.
- **Language selector** сохраняет текущую страницу (с учётом локализованных slug) и запоминает выбор в cookie.
- **Контроль в CI:** скрипт сверяет, что у всех языков одинаковый набор ключей. В dev отсутствующий перевод виден сразу, в production временно показывается EN.
- **Новый язык:** одна строка в конфиге, файл сообщений и переводы в CMS. Код страниц не меняется.

---

## 11. Translation workflow

1. **Источник — EN.** Беру тексты с живого сайта BCC и утверждённого макета, без изменений смысла.
2. **Глоссарий** (`translations/glossary.md`): единые термины на 4 языках:
   - Business Center / Centre d'affaires / Businesscenter / Business Center;
   - Co-working space / espace de coworking / Coworking-Space / Coworking-Space;
   - Private office / bureau privé / Privatbüro / Privatbüro;
   - Meeting room / salle de réunion / Besprechungsraum / Reunionsraum;
   - Company domiciliation / domiciliation d'entreprise / Firmendomizilierung / Firmendomizilatioun;
   - также термины IT, Cloud, AI, Cybersecurity, Managed Services, Consulting, Infrastructure, если они появятся в текстах.
3. **Перевод:**
   - профессиональный, естественный, корпоративный тон;
   - без новых фактов, без изменения утверждений, без упрощений;
   - FR и DE с формальным обращением (vous / Sie);
   - LU с принятым в бизнес-коммуникации «Dir».
4. **Метки для проверки** (`translations/review-notes.md`): каждая двусмысленная фраза с вариантами и моей рекомендацией.
   - Пример: «Building tomorrow's now» — игра слов, дословного аналога нет.
   - Пример: «Your trusted partner» — FR «partenaire de confiance» / DE «Ihr verlässlicher Partner».
   - Все люксембургские тексты помечаются для проверки носителем: ресурсов и устоявшейся деловой терминологии на люксембургском меньше, чем для FR и DE, поэтому финальная вычитка носителем обязательна перед запуском.
5. **Отзывы клиентов:** это цитаты реальных людей. Рекомендую **оставить на языке оригинала** (EN) и не переводить, чтобы не вкладывать слова в чужие уста. Альтернатива — перевод с пометкой «переведено». Решение за вами (отмечено в review-notes).
6. **Статус перевода в CMS:** «черновик → на проверке → утверждено». Production-сборка показывает предупреждение, пока есть неутверждённые переводы.

---

## 12. Contact form architecture

```
ContactForm (client)
  RHF + Zod (та же схема, что на сервере) · honeypot · метка времени · Turnstile
        │  POST /api/contact  (JSON, same-origin)
        ▼
route.ts (Node runtime)
  1. метод и Content-Type → 405/415
  2. размер тела ≤ 16 КБ → 413
  3. Origin/Sec-Fetch-Site → 403
  4. rate limit (IP-hash + глобальный) → 429
  5. Zod parse (strict) → 400 + ошибки по полям
  6. honeypot / время → «успех» без отправки (не подсказываем ботам)
  7. Turnstile verify → 400
  8. нормализация и санитизация
  9. EmailProvider.send()  ← выбирается по EMAIL_PROVIDER
 10. ответ 200 / 502 (ошибка провайдера, без деталей)
        ▼
lib/email/
  EmailProvider { send(message): Promise<Result> }
  ├─ smtp.ts      (Nodemailer; SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE)
  ├─ resend.ts    (RESEND_API_KEY)
  ├─ postmark.ts  (POSTMARK_TOKEN)
  └─ log.ts       (dev/staging: пишет обезличенную запись, письмо не отправляет)
  шаблоны: text + HTML (экранированные), reply-to = email отправителя (проверенный)
```

- **Поля:**
  - имя, email, телефон (необязательно);
  - тип рабочего места и размер команды (из finder);
  - сообщение ≤ 2000;
  - согласие (обязательно).
- **Состояния формы:**
  - idle, submitting (кнопка заблокирована, спиннер);
  - success (сообщение и сброс);
  - error (понятный текст, данные не теряются);
  - rate-limited (сообщение «попробуйте позже»).

  Все состояния объявляются через `aria-live`.
- **Env:** `EMAIL_PROVIDER=log|smtp|resend|postmark`, `CONTACT_TO` (пока пусто или ваш тестовый адрес; `info@bcc-lux.eu` поставим после подтверждения), `CONTACT_FROM`. Смена провайдера — только изменение env, код формы тот же.
- **Будущие формы** (запрос цены, бронирование) используют тот же конвейер: новая Zod-схема и новый route по шаблону.

---

## 13. Deployment plan

- **Не привязан к провайдеру:** один и тот же код и сборка.
  - **Vercel:** работает сразу; preview на каждую ветку, защита паролем.
  - **Netlify:** официальный Next.js runtime; `netlify.toml` в репозитории.
  - **Свой Node-сервер:** `output: "standalone"`, `Dockerfile` (multi-stage, non-root user), `docker-compose.yml` (web + redis), пример конфига Caddy (HTTPS, сжатие, кеш-заголовки).
- **Studio:** `sanity deploy` (хостинг Sanity, например `bcc.sanity.studio`) или отдельный маршрут на своём домене.
- **Rate limit store:** Upstash (Vercel, Netlify) или Redis из docker-compose (свой сервер), выбирается через env.
- **Мониторинг:** uptime, логирование ошибок без персональных данных (Sentry или аналог), алерт на сбои формы.

---

## 14. GitLab repository structure

- **Репозиторий** `bcc-web` в GitLab. У меня сейчас **нет доступа к GitLab**, поэтому создаю проект **локально как отдельную папку `bcc-web`**, полностью вне репозитория `tabs`, со своей git-историей. Push в GitLab делаете вы (или даёте мне доступ). Передам вам архив или git-bundle.
- **Ветки:**
  - `main` — production-ready, защищена, только через MR;
  - `develop` — интеграция, деплоится на staging;
  - `feature/*`, `fix/*`.
- **`.gitlab-ci.yml`, стадии:**
  - `install` → `lint` → `typecheck` → `test` (unit) → `build` → `e2e` (Playwright + axe) → `lighthouse` → `security` (pnpm audit + GitLab SAST, Dependency Scanning, Secret Detection) → `deploy:staging` (из `develop`) → `deploy:production` (из `main`, **только вручную**).
- **CI/CD variables:** все секреты masked + protected, отдельно для `staging` и `production`.
- **Шаблоны MR и issue**, `CODEOWNERS`, `CHANGELOG.md`.
- **В git никогда не попадают:** `.env*` (кроме `.env.example`), ключи, пароли SMTP, токены. Для этого `.gitignore`, pre-commit gitleaks и GitLab Secret Detection.

---

## 15. Staging → testing → production

1. **Local:** разработка, fallback-данные или Sanity dataset `development`.
2. **Staging** (из `develop`): закрыт паролем, noindex, dataset `staging`, `EMAIL_PROVIDER=log` или тестовый SMTP. Здесь вы проверяете дизайн, тексты и переводы.
3. **Testing (на staging):**
   - автотесты CI;
   - ручной прогон по чек-листу: 6 типов устройств × 4 языка;
   - формы (успех, ошибки, спам, лимиты);
   - Lighthouse и axe;
   - security headers (Mozilla Observatory A+);
   - проверка прав в CMS.
4. **Production** (из `main`, ручной запуск) — **только когда закрыт весь чек-лист:**
   - [ ] адаптив на всех 6 типах устройств утверждён;
   - [ ] подключён реальный SMTP, подтверждён адрес получателя, SPF/DKIM/DMARC;
   - [ ] Privacy Policy и Legal Notice заполнены и утверждены (флаг в CMS; иначе сборка останавливается);
   - [ ] переводы EN/FR/DE/LU проверены (LU носителем);
   - [ ] права в CMS проверены;
   - [ ] security checks пройдены;
   - [ ] performance-бюджеты выполнены;
   - [ ] формы протестированы;
   - [ ] все языковые маршруты и редиректы протестированы.
5. **Переключение домена** — отдельное решение BCC. До этого живой WordPress-сайт работает как есть.

---

## Этапы реализации

1. **Каркас:** монорепозиторий, Next.js + TS, линтеры, токены, шрифты, i18n-роутинг на 4 языках, Header (с выпадающим языковым селектором) и Footer, security headers и CSP, env-валидация, `.gitlab-ci.yml`, Docker, README.
2. **CMS:** схемы Sanity, Studio, слой `lib/cms` с fallback-данными (сайт работает и без проекта Sanity).
3. **Главная:** все секции по макету, устойчивые к количеству контента; адаптив; анимации; видео-пайплайн.
4. **Contact:** форма и полный конвейер защиты, email-адаптеры (`log` по умолчанию).
5. **About Us, Services, News, Legal** (заглушки), 404; SEO (metadata, OG, JSON-LD, sitemap, robots).
6. **Переводы FR/DE/LU** + глоссарий + review-notes.
7. **Проверки:** Playwright на 8 ширинах × 4 языка, axe, Lighthouse, security review. Сдача на staging.

## Что нужно от вас (не блокирует старт)

- **Проект Sanity:** создать на корпоративный аккаунт и проверить DPA и хранение данных (пока работаем на fallback-данных).
- **Доступ к GitLab** или push проекта самостоятельно.
- **Ключи Cloudflare Turnstile** (бесплатно) и Upstash для staging. Пока в dev тестовые ключи Turnstile и in-memory лимит.
- **Решение по отзывам клиентов:** оставить на EN (рекомендую) или переводить с пометкой.
