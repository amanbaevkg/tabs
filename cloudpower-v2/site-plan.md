# Cloud Power: extending the homepage redesign to the whole site (plan for review)

Source: every URL in the cloud-power.eu sitemap, read on 25 Sept 2026. Nothing on the live site has been changed.

## 1. Current pages

| # | URL | What it is | State |
|---|---|---|---|
| 1 | `/` | Homepage | Redesigned (Concept V2.1, approved direction) |
| 2 | `/our-services/` | Overview of all services | Real content |
| 3 | `/managed-services/` | Cloud Services (Private Cloud, Backup), Infrastructure, SOC teaser, Performance Review | Real content |
| 4 | `/ai/` | "Artificial Intelligence by Cloud Power": 9 AI-agent domains, 4 strengths, "Who Will Benefit?" | Real content |
| 5 | `/soc-as-a-service-24-7-…/` | SOC as a Service: 24/7 SOC, CERT, local team, 4 service blocks, risks | Real content |
| 6 | `/consulting/` | "Expertise Consulting": Development, Infrastructure, Expertise | Real content |
| 7 | `/digital-conception/` | Website conception, Mobile App, Platform Conception | Real content |
| 8 | `/baas/` | "BaaS - Back up as a Service": one line ("We secure your data") + form | Almost empty |
| 9 | `/contact-us/` | Form + address, hours, phone, email, LinkedIn, vendor invoice note | Real content |
| 10 | `/cloud-power-news/` | News listing (3 articles) | Real content |
| 11 | `/2025/09/10/smes-and-cybersecurity-…/` | Article: SMEs and Cybersecurity | Real content |
| 12 | `/2025/09/11/the-public-sectors-genai-journey-…/` | Article: The Public Sector's GenAI Journey | Real content |
| 13 | `/2025/10/02/elementor-1824/` | Article: Driving Digital Transformation (KV Smart) | Real content, bad URL |
| 14 | `/our-story/` | **Unedited template text** ("A Brief Heading", "Benefit 1", bread photos, "Client Name") | Public by mistake |
| 15 | `/sample-page/` | WordPress default "Sample Page" | Public by mistake |
| 16 | `/global-styles/` | Elementor style preview page | Public by mistake |
| 17–18 | `/category/news/`, `/category/uncategorized/` | Automatic archives | Covered by the News template |

## 2. Pages to redesign

**Redesign (8 pages + 1 template):** Our Services · Managed Services · AI · SOC as a Service · Consulting · Digital Conception · Contact Us · News listing · **Article template** (used by all 3 articles).
**Optional:** a 404 page in the same style.

**Do not redesign; remove or redirect instead:**
- Our Story, Sample Page, Global Styles: unpublish or delete. Our Story in particular shows placeholder text and bread photos to anyone who finds it.
- BaaS: merge into Managed Services (Backup section) and 301-redirect `/baas/` to `/managed-services/#backup`.
- Rename the article URL `elementor-1824` (e.g. `/driving-digital-transformation-smes-luxembourg/`) with a redirect.

## 3. Proposed structure per page

Every page: shared header → **page hero** (purpose in one line) → page-specific content → **one closing contact band** → shared footer.

**Our Services (the hub: "what can Cloud Power do for me?")**
1. Hero: "Our Services" / "Our teams are here to help you with most of your projects."
2. Service index: 6 large rows (Managed Services, Private Cloud, AI, SOC as a Service, Consulting, Digital Conception). Each has a one-line summary, its sub-offers as tags, and an arrow to the detail page. Detailed descriptions live only on the detail pages.
3. "Your IT Partner": Prioritize your projects · Optimize your internal resources · Reallocate your expenses. This is its only appearance on the site.
4. Closing band: "Take your IT setup to the next level" and its paragraph from this page.

**Managed Services ("what we can run for you")**
1. Hero: "Managed Services" / "Free yourself from specific tasks. We can take them off your hands."
2. Sticky sub-navigation: Cloud Services · Infrastructure · Performance Review.
3. Cloud Services: Private Cloud (6 items) and **Backup as a service** (6 items + "We secure your data", merged from BaaS).
4. Infrastructure: three columns: Installation & configuration (5 items) · Managed local infrastructure (4) · Support (3).
5. Performance Review: "Observability & Performance Automation Services, an IBM-Powered solution that meets key FinOps capabilities" + 5 capabilities.
6. SOC: one linking row to the SOC page, carrying "65% of cyber attacks have an impact on business (CESIN, 2025)". No repeated SOC content.
7. Closing band: "Any Questions ? Need a Quote ?"

**Artificial Intelligence ("where AI agents bring value")**
1. Hero: "Artificial Intelligence by Cloud Power" + the "Why It Matters" paragraph.
2. "What we can do for you ?": an **interactive domain selector** (HR, Sales, IT, Customer Service, Productivity, Finance, Healthcare, Legal, Supply Chain). Each domain shows its "Business impact" list and, where the site has one, its figure.
3. "How AI Agents Strengthen Business Performance": Flexibility · Enterprise-grade · Cost optimization · Rapid deployment.
4. "Who Will Benefit?": the 4 audiences.
5. Closing band: "Need more information ?"

**SOC as a Service ("protect the business 24/7")**
1. Hero: "SOC as a Service" / "24/7 Cybersecurity Monitoring with a Managed Security Operations Center" / "24/7 incident detection and response thanks to a team of cybersecurity experts."
2. Three commitments: 24/7 expert supervision · A complete CERT security package · A local team.
3. Service scope: 4 blocks (EDR/Digital Workspace | Protection · SOC 24/7 | Managed Services · Control | Customized · Incident response).
4. "Your company is a Target. Make it a Fortress": Risks & impacts, Consequences, and the page's figures (see section 5 on sources).
5. "Protect yourself from cyber attacks with our European SOC. Managed by a team of experts 24/7."
6. Closing band: "Protect yourself from threats now" + "Contact us to make yourself secure. Our experts will get back to you to review your current IS issues."

**Consulting ("experts who join your teams")**
1. Hero: "Expertise Consulting" / "Skilled experts, ready to join your teams".
2. The problem and the answer: "Finding the right people…" + "Because getting expert help to add value."
3. Three pillars: Development · Infrastructure · Expertise (page texts), with the role lists from Our Services.
4. Statement: "Technology is simple with people you can trust" + "Whether you're starting from scratch…". This quote appears only here.
5. Closing band: "Need more information ?"

**Digital Conception ("digital products we build")**
1. Hero: "Digital Conception" / "Discover a Smarter Way to improve your digital renown" + the two intro sentences.
2. Three offers: Website conception · Mobile App · Platform Conception, with a device visual.
3. The two project logos currently on the page: shown only if Cloud Power confirms what they are.
4. Closing band: "Need more information ?"

**Contact Us ("the one place to get in touch")**
1. Hero: "We would love to hear from you." / "Feel free to reach out using the below details."
2. Form (Name, Email, Phone, Message) alongside the details: Address, Hours, Phone, Email, LinkedIn.
3. The **only** "Schedule an appointment" link on the site (one booking URL).
4. Vendor note: "If you are a vendor please use invoice@cloud-power.eu for all invoices."
5. Map. No closing band on this page.

**News (listing)**
1. Hero: "Cloud Power News" + its intro sentence.
2. Latest article as a large featured item, then the other articles in a grid, each with date and topic.

**Article template**
1. Title, date, reading time. Comfortable reading width with headings, lists and images.
2. At the end, **one** contextual link to the related service (cybersecurity article → SOC, GenAI → AI, digital transformation → Managed Services), instead of the current 2–3 contact buttons.
3. Previous / next article.
4. Comments: recommend switching them off (they attract spam).

## 4. Shared elements (the design system)
- **Header:** logo · "Our Services ▾" menu (the 5 service pages + "All services") · News · one "Contact Us" button. It hides on scroll down and returns on scroll up.
- **Footer:** slim: logo, Our Services, News, Contact Us, LinkedIn, "© 2025 Cloud Power Luxembourg SA".
- **Type and colour:** Geist / Geist Mono; teal #002F35, abyss #001A1E, cyan #12D3D8, mint and paper.
- **Components:**
  - page hero (dark, with the streak animation at lower intensity than the homepage)
  - mono labels
  - slash-shaped buttons and slash-step section edges at the logo's 19° angle
  - tags
  - service index rows
  - numbered lists for real sequences only
  - figures with source and bar drawn to scale
  - FAQ accordion
  - animated line drawings
  - the closing contact band
- **Motion:** the same reveal-on-scroll, count-up, hover and header behaviour as the homepage, respecting "reduce motion".
- **Navigation between services:** a small "Other services" row just above the footer on the 5 service pages (text links, no cards).
- **One contact action:** "Contact Us" to the Contact page, in the header and in one closing band per page.

## 5. Repeated or unnecessary content to merge or remove
1. **Contact actions:**
   - Four pages embed their own contact form (AI, Consulting, Digital Conception, BaaS).
   - Two different booking links are in use (`/book/89996c28` and `/appointment/9?...`).
   - The homepage has three "Click Here" links.

   Replace all of these with one Contact page (form + one booking link) and one "Contact Us" action per page.
2. **SOC content:** it is repeated on Managed Services, in the homepage FAQ and on the SOC page. Keep the details on the SOC page only.
3. **"65% of cyber attacks impact business":** it appears 4 times (homepage, Managed Services, and twice on the SOC page). Keep it on the homepage figures and once on the SOC page.
4. **"Prioritize your projects / Optimize your internal resources / Reallocate your expenses":** it is on Our Services, on Managed Services and in the current homepage Managed Services panel. Keep it on Our Services only. On the homepage, those tags would become Cloud Services · Infrastructure · Performance Review (one small change to the approved homepage, only with your OK).
5. **"Technology is simple with people you can trust":** it is on AI and Consulting. Keep it on Consulting only.
6. **Our Services:** it repeats the long Website/Portal and Mobile App paragraphs from Digital Conception. Use one-line summaries on the hub.
7. **BaaS page:** merge into Managed Services.
8. **Leftover pages:** remove Our Story, Sample Page and Global Styles.
9. **Figures without a source on the page:** please confirm their source, or approve removing them.
   - AI page: "40% Reduction of HR operating budget", "40% Improvement in qualify of outreach content", "80% inquiries resolved via AskIT", "50% Reduction in support tickets…", "50% Reduction in time spent on manual, repetitive tasks", "15% Enterprise workforce comprised of contractors".
   - SOC page: "Cyber attacks up 23% in 2024", "500+ SMEs protected".
10. **Typos to fix site-wide:**
   - Infrastucture
   - Archicects
   - develoment
   - Environnement
   - appoitnment
   - Ressources
   - "More informations"
   - "qualify" (should be "quality")
   - "Soc as a Service"
