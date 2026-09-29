# BCC: план production-реализации

Статус: **на утверждение**. Код не пишется, пока план не подтверждён.
Основа — утверждённый макет Concept 1 (v2.3, hero-видео «черновик 9»). Живой сайт businesscentercapellen.lu не трогаем: работаем только в staging.

---

## 1. Рекомендуемый stack

| Слой | Выбор | Почему |
|---|---|---|
| Framework | **Next.js 15 (App Router)** + React 19 | SSR/SSG из коробки (SEO), маршрутизация, оптимизация изображений и шрифтов, route handlers для API. Деплой на Vercel, Netlify или свой Node-сервер. |
| Язык | **TypeScript** (strict) | Типы для контента, переводов, форм и API, меньше ошибок при расширении. |
| Рендеринг | React Server Components + статическая генерация (SSG) всех страниц для всех языков | Почти весь сайт — статический контент, поэтому минимум JS в браузере и быстрая отдача с CDN. Клиентские компоненты только там, где есть интерактив. |
| Стили | **CSS Modules + дизайн-токены (CSS custom properties)**, без Tailwind | Макет сделан на «ручном» CSS с тонкой типографикой. CSS Modules сохраняют его точно, изолированы по компонентам и не требуют рантайма. Токены (цвета, шрифты, отступы, брейкпоинты) лежат в одном месте. |
| Анимации | CSS (transitions, keyframes) + маленький хук IntersectionObserver; **Motion** (бывший Framer Motion) только точечно и с ленивой загрузкой | См. раздел 6. GSAP не нужен: анимаций немного, и они простые. |
| i18n | **next-intl** | Стандарт для App Router: локализованные URL, ICU-сообщения, форматирование дат и чисел, статическая генерация. |
| Контент | Типизированные файлы контента в репозитории (TS/JSON по языкам) за единым слоем `lib/content` | Контента пока немного. Headless CMS (Sanity, Payload или Strapi) можно подключить позже, заменив только этот слой: компоненты не меняются. |
| Формы | React Hook Form + **Zod** (одна схема для клиента и сервера) | Одинаковая валидация в браузере и на сервере. |
| Email | **Resend** или Postmark (API), либо SMTP вашего домена через Nodemailer | Надёжная доставка, SPF/DKIM на домене BCC. |
| Анти-спам | **Cloudflare Turnstile** + honeypot + проверка времени заполнения | Turnstile не требует кликать по картинкам и дружелюбнее к GDPR, чем reCAPTCHA. |
| Rate limiting | **Upstash Redis** (serverless) или Redis на своём сервере | Работает между serverless-инстансами. |
| Изображения | `next/image` + sharp: AVIF/WebP, адаптивные размеры | См. раздел 8. |
| Видео | Собственные файлы в нескольких разрешениях (MP4 H.264 + WebM VP9) + постер; позже при желании Mux или Cloudflare Stream | См. раздел 8. |
| Шрифты | `next/font/local`: Archivo, Newsreader, IBM Plex Mono, self-hosted, subset latin/latin-ext | Без запросов к Google, без сдвигов вёрстки. |
| Качество | ESLint, Prettier, TypeScript, Vitest + Testing Library, **Playwright** (e2e + визуальные снимки на 6 ширинах) + **axe** (доступность), Lighthouse CI | Автоматическая проверка каждого изменения. |
| Инструменты | pnpm, Node 22 LTS, Husky + lint-staged, GitHub Actions, Renovate/Dependabot | |

**Backend.** Отдельного сервера нет. Node нужен только для route handlers Next.js: `POST /api/contact` (позже `/api/quote`, интеграции с CRM, бронированием и т.п.). Всё остальное — статика.

---

## 2. Структура проекта

```
bcc-web/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # <html lang>, шрифты, Header, Footer, SkipLink
│   │   ├── page.tsx              # главная
│   │   ├── about-us/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── legal/[slug]/page.tsx # privacy, legal notice, cookies
│   │   └── not-found.tsx
│   ├── api/contact/route.ts      # POST: валидация, анти-спам, rate limit, email
│   ├── sitemap.ts                # sitemap.xml со всеми языками и hreflang
│   ├── robots.ts                 # robots.txt (на staging: Disallow: /)
│   └── manifest.ts, icon, opengraph-image
├── components/
│   ├── layout/    Header, MobileNav, LanguageSwitcher, Footer, SkipLink
│   ├── sections/  Hero, WorkspaceFinder, OfferCoworking, OfferPrivate, ServicesLink,
│   │              TrustMarquee, TomorrowBanner, SpacesGallery, FindMoreCta,
│   │              Testimonials, FinalCta, LocationMap
│   ├── forms/     ContactForm, FormField, TurnstileWidget
│   ├── media/     HeroVideo, ResponsiveImage, ClickToLoadMap
│   └── ui/        Button, TextLink, Container, Section, Heading, Eyebrow, Icon,
│                  Listbox (доступный dropdown), Carousel, VisuallyHidden, Toast
├── content/       # тексты страниц по языкам (типизировано), списки услуг, логотипов, отзывов
│   ├── site.ts    # адрес, телефон, email, соцсети: одно место
│   └── pages/home.{en,fr,de,lb}.ts
├── messages/      # UI-строки i18n: en.json, fr.json, de.json, lb.json
├── lib/
│   ├── content/   # единый доступ к контенту (позже: CMS-адаптер)
│   ├── i18n/      # конфиг next-intl, routing, pathnames
│   ├── seo/       # metadata builder, JSON-LD
│   ├── security/  # rate limit, turnstile verify, sanitize, origin check
│   ├── email/     # отправка и шаблоны писем
│   └── env.ts     # валидация переменных окружения (Zod), server-only
├── styles/
│   ├── tokens.css      # цвета, типографика, отступы, радиусы, z-index, брейкпоинты
│   ├── base.css        # reset, базовая типографика, focus-стили
│   └── utilities.css   # немного общих утилит (visually-hidden и т.п.)
├── public/
│   ├── media/video/    # hero-1080.mp4/webm, hero-720…, hero-480…, poster
│   └── media/images/   # исходники фото (next/image сам делает AVIF/WebP)
├── middleware.ts       # определение языка, CSP-nonce, базовая защита staging
├── next.config.ts      # security headers, images, redirects
├── tests/  e2e/ (Playwright), unit/ (Vitest)
├── .env.example        # список переменных без значений
└── docs/               # README, архитектура, как добавить страницу/язык/услугу, деплой
```

**Расширяемость:**
- новая страница — одна папка в `app/[locale]/…` плюс контент;
- новая услуга — запись в `content/services`;
- новый язык — файл сообщений и контента плюс одна строка в конфиге;
- новая форма — схема Zod плюс route handler по шаблону `contact`.

---

## 3. Routing strategy

- **URL с префиксом языка:** `/en/…`, `/fr/…`, `/de/…`, `/lb/…`. В интерфейсе переключатель показывает «LU», а в коде используется код `lb` (ISO-стандарт для люксембургского).
- **Корень `/`:** при первом визите определяем язык по `Accept-Language` и cookie и делаем 302 на нужный язык. Поисковикам отдаём `x-default`.
- **Локализованные slug'и** через `pathnames` в next-intl: например, `/en/about-us`, `/fr/a-propos`, `/de/ueber-uns`. Всё задаётся в одном конфиге.
- **Сохраняем SEO текущего сайта:** `/about-us/` и `/contact/` сохраняют смысл, со старых адресов ставим 301 на `/en/about-us`, `/en/contact` (или на язык по умолчанию, см. вопросы). Якоря `#services` и `#offices` сохраняем.
- **Страницы v1:**
  - Home;
  - About Us (с секциями Services и Offices);
  - Contact;
  - юридические страницы: Privacy Policy, Legal Notice, Cookies (для GDPR в Люксембурге обязательны);
  - 404.
- **Задел на будущее:**
  - отдельные страницы услуг: `/offices/private`, `/coworking`, `/meeting-rooms`, `/domiciliation`;
  - страница пространства: `/spaces/[slug]`;
  - новости или блог: `/news/[slug]`.
- **API:** `/api/contact` (POST, только same-origin). Кнопка «Get a Quote» в hero ведёт на `/contact?workspace=private&size=4` и заранее заполняет форму.

---

## 4. Component architecture

**Принципы:**
- компоненты по умолчанию серверные;
- `"use client"` только для интерактива;
- тексты не хранятся внутри компонентов, приходят из контента и i18n через props;
- у каждого компонента свой `*.module.css`.

| Компонент | Тип | Что делает |
|---|---|---|
| `Header` | client (скролл) | Прозрачный над hero; при скролле непрозрачный; прячется при скролле вниз. Содержит логотип, навигацию, `LanguageSwitcher`, CTA. |
| `MobileNav` | client | Полноэкранное меню ≤ 899 px: фокус внутри меню, закрытие по Esc, блокировка скролла, `aria-expanded`. |
| `LanguageSwitcher` | client | EN / FR / DE / LU. На десктопе ряд кнопок, на мобильном список. Переходит на ту же страницу в другом языке. |
| `Hero` | server | Заголовок (единственный H1), подзаголовок, `HeroVideo`, `WorkspaceFinder`, бейдж «Work with us». |
| `HeroVideo` | client | Постер как `next/image` с priority (это LCP); видео подгружается после загрузки страницы. Выбор разрешения по ширине экрана; пауза вне экрана; учёт reduced motion и Save-Data. |
| `WorkspaceFinder` | client | Два доступных Listbox (роль `listbox`, клавиатура, `aria-activedescendant`) и кнопка → `/contact` с параметрами. На мобильном вертикальный. |
| `OfferCoworking`, `OfferPrivate` | server | Блоки с фото и текстом (раскладка из последней версии макета). |
| `TrustMarquee` | server + крошечный client | Бегущая лента логотипов на CSS. Пауза при наведении и фокусе, остановка при reduced motion; для скринридеров обычный список. |
| `TomorrowBanner`, `FinalCta` | server | Фоновое фото через `next/image` с `fill` и затемнением. |
| `SpacesGallery` | client | Горизонтальная галерея на CSS scroll-snap: стрелки, счётчик, прогресс, свайп, клавиатура. На мобильном по одному слайду. |
| `Testimonials` | server | Отзывы (`figure`/`blockquote`/`figcaption`), звёзды с текстовой альтернативой. |
| `ContactForm` | client | RHF + Zod, Turnstile, honeypot, понятные ошибки, `aria-live`. |
| `LocationMap` | client | Статичная картинка карты; настоящая Google-карта грузится только по клику (приватность и скорость). |
| `Footer` | server | Контакты, адрес (`<address>`), ссылки, соцсети, языки, юридические ссылки. |
| `ui/*` | mixed | Button (варианты по дизайну), TextLink, Heading (уровень независим от стиля), Container, Section, Icon (inline SVG-спрайт), Listbox, Carousel, Toast. |

Существующий плавающий контакт-ассистент на живом сайте в план не входит. Если захотите его на новом сайте, подключим как внешний скрипт с разрешением в CSP.

---

## 5. Responsive breakpoints

Сетка токенов (mobile-first):

| Имя | Ширина | Устройства |
|---|---|---|
| `xs` | < 380 px | маленькие телефоны (iPhone SE, старые Android) |
| `sm` | 380–599 px | обычные и большие телефоны |
| `md` | 600–899 px | планшет портрет |
| `lg` | 900–1199 px | планшет ландшафт, маленькие ноутбуки |
| `xl` | 1200–1535 px | ноутбуки, десктоп (макет рассчитан на 1440) |
| `2xl` | ≥ 1536 px | большие мониторы: контент ограничен по ширине, фоны на всю ширину |

Типографика плавная через `clamp()`. Для карточек используем container queries. Проверяем в Playwright на 360, 390, 430, 768, 1024, 1280, 1440 и 1920 px.

Что меняется по ширинам (не просто уменьшение):

- **Header:**
  - на `lg`+ центрированная навигация и языки ряд;
  - на `md` и ниже бургер, полноэкранное меню с языками и CTA внутри.
- **Hero:**
  - на `lg`+ высота около 840 px, заголовок по центру, finder в строку;
  - на `md` и ниже высота 100svh, текст крупнее и компактнее, finder вертикальный (поля друг под другом, кнопка во всю ширину), бейдж скрыт.
- **Hero-видео:**
  - на `xl`+ 1080p;
  - на `md`–`lg` 720p;
  - на `sm`/`xs` 480p и короче (или только постер при Save-Data или медленной сети).
- **Workspace finder:** на `md`+ выпадающие списки; на `sm`/`xs` нативный стиль списка во весь экран снизу (bottom sheet) для удобного тапа.
- **Co-working и Private offices:**
  - на `lg`+ композиция «фото + карточка с наложением»;
  - на `md` фото над текстом, наложение меньше;
  - на `sm` и ниже фото и текст стопкой, второе фото скрыто или уходит в галерею.
- **Typography:** крупные заголовки (OUR SPACES, BUILDING TOMORROW'S NOW) уменьшаются через clamp; на `xs` меняется разбивка строк, чтобы слова не рвались.
- **Galleries:**
  - на `xl` несколько слайдов разной высоты;
  - на `md` по 1,5 слайда;
  - на `sm` по одному слайду во всю ширину со свайпом.
- **Logo carousel:** на всех ширинах; на мобильном плитки меньше и лента медленнее.
- **Testimonials:** на `lg`+ две колонки (заголовок sticky); на `md` и ниже одна колонка.
- **Forms:** на `md`+ поля в две колонки; на мобильном в одну. Поля от 44 px высотой, правильные `inputmode` и `autocomplete`.
- **Footer:**
  - на `xl` 5 колонок;
  - на `md` 2 колонки;
  - на `sm` 1 колонка с раскрывающимися группами.

Плюс общие правила: минимальная зона тапа 44×44 px, отступы безопасной зоны iOS (`env(safe-area-inset-*)`), без горизонтального скролла.

---

## 6. Animation strategy

- **По умолчанию CSS:** hover-эффекты, вращение бейджа, бегущая лента, появление блоков при скролле (IntersectionObserver добавляет класс, дальше работает CSS transition). Никакой JS-анимации там, где хватает CSS.
- **Motion (motion.dev)** только для 2–3 мест, где нужна физика или жесты: открытие мобильного меню, bottom-sheet finder, возможно галерея. Грузится лениво, только в клиентских компонентах, которым он нужен.
- **GSAP не используем:** сложных таймлайнов в дизайне нет, а лишние 30–60 КБ JS ухудшат INP и LCP.
- **`prefers-reduced-motion: reduce`:**
  - лента логотипов и бейдж останавливаются;
  - появление блоков без сдвигов (только мгновенная видимость);
  - hero-видео не запускается автоматически, показывается постер и кнопка «▶ Play»;
  - плавный скролл отключён.
- Анимируем только `transform` и `opacity`, чтобы не было пересчёта вёрстки и CLS.

---

## 7. Security plan

| Угроза | Меры |
|---|---|
| **XSS** | React экранирует вывод. `dangerouslySetInnerHTML` только для JSON-LD, сериализуется безопасно (экранирование `<`). Контент из репозитория доверенный, будущий CMS-контент будет санитизироваться (DOMPurify/sanitize-html) при рендере rich text. Строгий **CSP с nonce** через middleware. |
| **CSRF** | Форма шлёт POST на свой же домен. Сервер проверяет `Origin`/`Host` (same-origin only), принимает только `Content-Type: application/json`, cookies для авторизации не используются. При переходе на Server Actions действует их встроенная проверка origin. |
| **Injection** | Базы данных в v1 нет. Все входные данные проходят строгие Zod-схемы (типы, длины, форматы, `strict()` без лишних полей). **Email header injection:** удаляем `\r\n` из имени, email и темы; адрес получателя фиксирован на сервере. Тело письма экранируется (HTML-escape) перед вставкой в шаблон. |
| **Brute force / спам / боты** | Cloudflare Turnstile (проверка токена на сервере), honeypot-поле, минимальное время заполнения (например, ≥ 3 с), **rate limit**: 5 заявок за 10 минут с одного IP плюс глобальный лимит, ограничение размера тела запроса (например, 10 КБ), отказ без подробностей. |
| **Secure headers** | `Content-Security-Policy` (nonce, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, разрешены только нужные домены: Turnstile, карта по клику), `Strict-Transport-Security` (preload после проверки), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (камера, микрофон, геолокация выключены), `Cross-Origin-Opener-Policy: same-origin`, `X-Frame-Options: DENY`. Заголовок `X-Powered-By` отключён. |
| **HTTPS** | Только HTTPS (на хостинге и через HSTS). HTTP → 301 на HTTPS. |
| **CORS** | API отвечает только своему домену, без `Access-Control-Allow-Origin: *`. На preflight от чужих origin отказ. |
| **Зависимости** | Минимум пакетов, lockfile в репозитории, `pnpm audit` и **CodeQL** в CI, Renovate или Dependabot с автоматическими PR, только проверенные пакеты. |
| **Secrets** | Ключи (email-API, Turnstile secret, Redis) только в переменных окружения на хостинге, отдельно для staging и production. `.env*` в `.gitignore`, в репозитории только `.env.example`. `lib/env.ts` валидирует переменные при старте и помечен `server-only`, чтобы секреты не попали в клиентский бандл. В браузер уходят только `NEXT_PUBLIC_*` (Turnstile site key, URL сайта). |
| **Formы и GDPR** | Галочка согласия со ссылкой на Privacy Policy. Данные формы не сохраняются в базе, только отправляются письмом. В логах нет персональных данных. Аналитика и трекинг только после согласия (или cookieless-аналитика, например Plausible). Google Maps грузится по клику. |
| **Staging** | Закрыт паролем (Vercel Deployment Protection или basic auth в middleware), заголовок `X-Robots-Tag: noindex`, `robots.txt` запрещает индексацию, отдельные ключи. |
| **Контроль** | Перед запуском: проверка заголовков (securityheaders.com, Mozilla Observatory, цель A+), e2e-тесты формы (валидация, honeypot, rate limit), ручной security review изменений. |

---

## 8. Performance plan

**Бюджеты (мобильный, 4G):**

| Метрика | Цель |
|---|---|
| LCP | < 2,0 с |
| CLS | < 0,05 |
| INP | < 200 мс |
| JS на главной | < 90 КБ gzip |
| Lighthouse Performance | ≥ 95 |

- **Изображения:** `next/image` делает AVIF и WebP, `srcset`/`sizes` под каждую раскладку, `loading="lazy"` для всего ниже первого экрана, `priority` только для постера hero, заданные размеры (без CLS), blur-placeholder. Исходники в хорошем качестве, сжатие автоматическое.
- **Hero-видео (главное для мобильных):**
  - LCP — это **постер** (AVIF/WebP), видео на LCP не влияет;
  - видео загружается после события load и в idle (`preload="none"`, подключение source через JS);
  - три версии: **1080p (~2,5 Мбит/с), 720p (~1,5), 480p (~0,8)**, в WebM VP9 и MP4 H.264, без звуковой дорожки;
  - на мобильных отдельная короткая петля 15–20 с в 480p (около 2 МБ вместо 14);
  - видео не грузится при `Save-Data`, медленной сети (`effectiveType` 2g/3g) и reduced motion — остаётся постер;
  - пауза, когда hero вне экрана.
- **Шрифты:** `next/font/local`, subset (latin, latin-ext для FR/DE/LU), `font-display: swap`, preload только основного начертания, fallback-метрики, чтобы не было CLS.
- **JS:** серверные компоненты для всего статического; клиентские острова маленькие; `dynamic()` для галереи, формы, карты и Motion. Разделение по маршрутам автоматическое.
- **Кеширование и CDN:** все страницы статически генерируются на этапе сборки (SSG) для всех языков. Позже, с CMS, добавится обновление по вебхуку (ISR/on-demand revalidate). Файлы с хешем кешируются навсегда (`immutable`), HTML через CDN. Видео и фото с долгим кешем.
- **Сторонние скрипты:** по умолчанию нет. Карта, аналитика и контакт-ассистент загружаются лениво и только по согласию или клику.
- **Контроль:** Lighthouse CI в каждом PR с бюджетами; Web Vitals (web-vitals + endpoint или аналитика) на staging и production.

---

## 9. i18n plan

- **Языки:** `en`, `fr`, `de`, `lb` (в интерфейсе «LU»). Архитектура позволяет добавить новый язык одной строкой в конфиге и набором файлов.
- **Библиотека:** next-intl. UI-строки в `messages/{locale}.json` с неймспейсами (`header`, `hero`, `form`, `footer`…), тексты страниц в `content/pages/*.{locale}.ts`. Формат ICU: множественное число («1 person / 2 persons»), даты, телефоны.
- **SEO-часть:** на каждой странице `hreflang` для всех языков плюс `x-default`, `<html lang>`, локализованные title и description, OG-теги, sitemap со всеми альтернативами. Локализованные slug'и.
- **Переключатель языка** ведёт на ту же страницу, выбор запоминается в cookie.
- **Отсутствующие переводы:** в development видны как ошибка, в production временно показывается EN. Скрипт в CI проверяет, что у всех языков одинаковый набор ключей.
- **Важно про контент:** сейчас на живом сайте весь текст только на английском. Переводы на FR, DE и LU нужно получить от BCC или от профессионального переводчика: я их не придумываю и не делаю машинный перевод «как финальный». Пока переводов нет, языки можно скрыть флагом и открыть по мере готовности.

---

## 10. Deployment plan

- **Окружения:**
  1. local (dev);
  2. **preview** на каждый PR;
  3. **staging** (например, `staging.businesscentercapellen.lu` или поддомен хостинга), с паролем и noindex;
  4. **production**, только после вашего письменного «ок».
- **Живой сайт** на WordPress не трогаем, пока вы не решите переключить DNS. Переключение — отдельный шаг по чек-листу (редиректы, проверка форм, SSL, HSTS, Search Console, sitemap).
- **CI (GitHub Actions)** на каждый PR:
  - `typecheck` → `lint` → `unit tests` → `build`;
  - Playwright e2e и визуальные снимки на 8 ширинах;
  - axe (доступность);
  - Lighthouse CI;
  - `pnpm audit`, CodeQL.

  Merge в `main` только при зелёном CI.
- **Хостинг (любой из трёх без переделки кода):**
  - **Vercel (рекомендую):** нативная поддержка Next.js, preview на каждый PR, защита preview паролем, глобальный CDN, переменные окружения по средам.
  - **Netlify:** через официальный Next.js runtime (OpenNext), с той же функциональностью.
  - **Свой Node-хостинг:** `output: "standalone"` + Docker-образ + Nginx или Caddy (HTTPS, gzip/brotli, кеш-заголовки) + PM2 или systemd. Rate limit на локальном Redis.
- **Email** на домене BCC (SPF, DKIM, DMARC), чтобы заявки не попадали в спам.
- **Мониторинг:** uptime-проверка, логирование ошибок (Sentry или аналог, без персональных данных), алерт, если форма перестаёт отправлять.
- **Документация:** README (запуск, переменные окружения, деплой), инструкции «как добавить страницу / язык / услугу / форму / фото / видео».

---

## Accessibility (сквозное требование)

Цель — **WCAG 2.2 AA**:
- один H1 на странице и корректная иерархия H2/H3 (на живом сайте сейчас H1 нет — исправим);
- skip-link, видимый focus, полная работа с клавиатуры (меню, finder, галерея, форма);
- `aria-*` только там, где нужно;
- контраст текста поверх видео и фото ≥ 4.5:1;
- альтернативный текст для фото, `lang` для каждого языка;
- `aria-live` для ошибок формы;
- ролики без звука и с кнопкой паузы.

Проверка: axe в CI плюс ручная проверка с VoiceOver и NVDA на ключевых сценариях.

---

## Этапы работ

1. **Каркас.** Next.js, TS, линтеры, CI, токены, шрифты, i18n-роутинг, Header и Footer, staging с паролем.
2. **Главная.** Все секции по макету, адаптив на 8 ширинах, анимации, видео-пайплайн (3 версии и мобильная петля).
3. **Остальные страницы.** Contact (форма с полной защитой), About Us, юридические страницы, 404.
4. **Под запуск.** SEO (metadata, OG, JSON-LD LocalBusiness, sitemap, robots), security headers и CSP, Lighthouse и axe до целевых значений, security review.
5. **Сдача.** Демонстрация на staging, ваши правки, документация. Переключение на production — отдельное решение.

---

## Вопросы, которые нужно решить до старта

1. **Язык по умолчанию и URL.** Главный язык EN (как сейчас) или FR? Префикс `/en/` у всех языков (рекомендую) или EN без префикса?
2. **Переводы FR/DE/LU.** Кто их даёт? До их получения запускаем только EN, а переключатель языков показываем неактивным?
3. **Email для заявок.** На какой адрес (info@bcc-lux.eu?) и какой сервис: Resend/Postmark или SMTP вашего почтового хостинга?
4. **Хостинг.** Vercel (рекомендую), Netlify или свой сервер?
5. **Репозиторий.** Отдельный новый (например, `bcc-web`, рекомендую) или папка в текущем `tabs`?
6. **Страницы v1.** Home, About Us, Contact и юридические страницы. Есть ли тексты Privacy Policy и Legal Notice, или их нужно запросить у юриста или BCC?
7. **CMS.** Сразу нужна возможность редактировать тексты без программиста, или пока достаточно контента в коде (CMS подключим позже)?
