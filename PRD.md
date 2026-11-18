# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Interactive Personal Portfolio Website

**Project Name:** Ridwan Faiz Herlambang — Personal Portfolio  
**Product Type:** Interactive Personal Portfolio Website  
**Version:** 1.0  
**Status:** Ready for Development  
**Framework:** Next.js + React + TypeScript  
**Animation Library:** Motion (Framer Motion)

---

# 1. PROJECT OVERVIEW

## 1.1 Project Background

Portfolio website ini dikembangkan sebagai personal branding platform untuk menampilkan identitas, kemampuan, pengalaman, dan hasil karya Ridwan Faiz Herlambang sebagai seorang mahasiswa Informatika yang memiliki ketertarikan pada Software Development, Frontend Development, UI/UX Design, dan Graphic Design.

Website tidak hanya berfungsi sebagai tempat menampilkan informasi profesional, tetapi juga sebagai representasi kemampuan dalam mengembangkan antarmuka digital yang interaktif, modern, dan memiliki karakter visual yang kuat.

Konsep utama website menggabungkan minimalist black-and-white design, modern editorial layout, dan industrial-inspired interaction.

Pengalaman pengguna akan diperkuat melalui animasi berbasis scrolling, interaksi cursor, transisi antarelemen, serta mekanisme navigasi dan project showcase yang interaktif.

## 1.2 Project Objectives

1. Membangun personal portfolio yang profesional dan memiliki identitas visual unik.
2. Menampilkan kemampuan teknis dan kreatif secara terstruktur.
3. Menyediakan showcase proyek dengan pengalaman interaktif.
4. Menunjukkan kemampuan implementasi React, Next.js, TypeScript, dan Motion.
5. Menerapkan praktik frontend security dan accessibility.
6. Menyediakan sarana komunikasi profesional melalui contact form yang terintegrasi dengan Resend.
7. Menghasilkan website yang responsif, cepat, dan mudah dikembangkan.

## 1.3 Target Audience

- Recruiter dan perusahaan teknologi.
- HR dan hiring managers.
- Software development teams.
- Calon klien atau pihak yang tertarik berkolaborasi.
- Developer dan komunitas teknologi.

---

# 2. DESIGN DIRECTION

## 2.1 Visual Identity

**Primary Design Concept:** Modern Minimalist + Industrial Editorial.

Website menggunakan pendekatan visual yang minimalis dengan dominasi warna hitam dan putih.

Karakter desain:

- Clean and minimal.
- Modern editorial typography.
- Strong visual hierarchy.
- Generous whitespace.
- Industrial-inspired elements.
- Smooth and purposeful animations.
- Consistent interaction patterns.

## 2.2 Color Palette

| Element | Color |
|---|---|
| Primary Background | #FFFFFF |
| Primary Text | #111111 |
| Secondary Background | #F5F5F5 |
| Secondary Text | #666666 |
| Border | #E5E5E5 |
| Dark Surface | #111111 |
| Light Surface | #FFFFFF |

Penggunaan warna aksen pada project locker diperbolehkan sebagai identitas masing-masing kategori, tetapi tetap harus mempertahankan konsistensi tema utama hitam dan putih.

## 2.3 Typography

Gunakan tipografi modern dengan karakter editorial.

Rekomendasi:
- Primary Font: Geist Sans atau Inter.
- Display Font: Geist Sans dengan weight tebal.
- Monospace Font: Geist Mono.

Penggunaan monospace diprioritaskan untuk elemen seperti:
- Sector identification.
- Project numbering.
- Technical labels.
- Small metadata.
- Industrial interface elements.

## 2.4 Animation Principles

Semua animasi harus memiliki tujuan dan tidak sekadar menjadi dekorasi.

Prinsip animasi:

1. Smooth and responsive.
2. Consistent easing.
3. Controlled animation duration.
4. Natural transitions.
5. No unnecessary looping animations.
6. Respect reduced-motion preferences.
7. Avoid excessive scroll hijacking.

---

# 3. NAVIGATION SYSTEM

## 3.1 Floating Pill Navigation

Website menggunakan floating pill navigation yang selalu tersedia selama pengunjung menjelajahi halaman.

Position:
- Fixed positioning.
- Horizontally centered.
- Positioned near the top of the viewport.
- High enough z-index to remain visible without blocking content.

## 3.2 Navigation Items

| Icon | Label | Target |
|---|---|---|
| House | Home | Hero |
| User Round | About | About Me |
| Code | Skills | Tech Stack |
| Briefcase | Experience | Experience |
| Layers | Projects | Project Showcase |
| Graduation Cap | Education | Education |
| Mail | Contact | Contact |

## 3.3 Navigation States

**Initial State — Expanded**

- Navigation tampil dalam bentuk horizontal pill.
- Menampilkan logo atau monogram RF.
- Semua navigation label terlihat.
- Ukuran dan spacing dibuat minimalis.

**Scrolling State — Compact**

Ketika pengunjung mulai melakukan scrolling:
- Navbar mengecil.
- Label teks menghilang.
- Hanya ikon navigasi yang ditampilkan.
- Ukuran pill menyesuaikan kontennya.

**Hover State — Expanded**

Ketika cursor diarahkan ke navigation pill:
- Navbar melebar kembali.
- Semua label navigasi muncul.
- Transisi lebar dan opacity berlangsung smooth.

**Active Section State**

- Ikon atau indikator section aktif mendapatkan visual distinction.
- Active state diperbarui berdasarkan section yang sedang terlihat.

## 3.4 Animation Requirements

Gunakan:
- Motion layout animation.
- AnimatePresence.
- useScroll atau scroll-position state.
- whileHover.
- Smooth anchor scrolling.

Mobile behavior:
- Tidak bergantung pada hover.
- Menggunakan tap untuk ekspansi.
- Memastikan seluruh navigasi tetap mudah diakses.

---

# 4. WEBSITE STRUCTURE & SECTION REQUIREMENTS

Website menggunakan pendekatan one-page portfolio dengan tujuh section utama.

## SECTION 01 — HERO

### Purpose

Menjadi bagian pembuka yang memperkenalkan identitas profesional dan karakter visual portfolio.

### Content

Main heading:

PORTFOLIO

Professional titles:

1. Frontend Developer
2. Software Developer
3. UI/UX Designer
4. Graphic Designer

### Visual Layout

- Main heading memiliki ukuran besar dan dominan.
- Professional titles berada tepat di bawah heading.
- Layout minimalis dengan whitespace yang cukup.
- Background menggunakan animasi subtil.

### Animation Requirements

**A. Text Reveal**
- Judul PORTFOLIO muncul melalui entrance animation.
- Menggunakan staggered reveal.
- Memiliki timing yang teratur.

**B. Rolling Counter / Slot Machine Text**
- Empat profesi ditampilkan menggunakan vertical rolling text.
- Mekanismenya menyerupai gulungan mekanis mesin kasino atau odometer.
- Setiap profesi berhenti secara berurutan.
- Menggunakan clipping container agar pergerakan terlihat seperti gulungan.
- Hindari visual mesin kasino yang terlalu literal.

**C. Animated Background**
- Subtle moving gradient.
- Grain texture.
- Ambient lighting.
- Tidak mengganggu keterbacaan konten.

---

## SECTION 02 — ABOUT ME

### Purpose

Memperkenalkan latar belakang, minat, dan identitas profesional.

### Layout

Menggunakan split layout:

**Left Side:**
- About Me heading.
- Personal introduction.
- Academic background.
- Professional interests.
- Personal development.

**Right Side:**
- Interactive dual portrait.

### Portrait Requirements

Terdapat dua foto dengan kondisi berbeda.

1. Default image: Foto menggunakan kemeja.
2. Hover image: Foto menggunakan almamater Telkom University.

### Interaction

Default:
- Foto berkemeja ditampilkan.

Hover:
- Ketika cursor diarahkan ke foto, foto almamater muncul.
- Perubahan menggunakan smooth image transition.
- Gunakan crossfade atau image reveal.
- Ketika cursor keluar, kembali ke foto berkemeja.

Mobile:
- Gunakan tap atau toggle interaction.
- Jangan mengandalkan hover.

### Animation Requirements

- Image parallax.
- Text reveal per paragraf.
- Floating decorative elements.
- Smooth portrait transition.

---

## SECTION 03 — TECH STACK & SKILLS

### Purpose

Menampilkan kemampuan teknis dan kreatif secara terstruktur.

### Skill Categories

**A. Programming**
- Java
- Python
- C++
- Go
- TypeScript

**B. Frontend Development**
- HTML
- CSS
- JavaScript
- React
- Next.js

**C. Tools**
- Git
- GitHub
- Figma

**D. Creative**
- Canva
- CapCut
- Adobe After Effects

### UI Requirements

- Skill cards dikelompokkan berdasarkan kategori.
- Menggunakan icon atau logo teknologi.
- Konsistensi ukuran dan spacing.
- Tampilan responsif.

### Animation Requirements

- Interactive skill cards.
- Hover tilt.
- Icon animations.
- Animated indicators.
- Scroll-triggered reveal.

Hindari penggunaan skill percentage yang tidak didukung pengukuran objektif.

---

## SECTION 04 — EXPERIENCE & ACTIVITIES

### Purpose

Menampilkan pengalaman organisasi, kepanitiaan, dan program pengembangan diri.

### Experience Data

**01. CCI Telkom University**
- Position: Media Management.
- Organization: UKM CCI Telkom University.
- Activities: Social media publication, event documentation, bumper videos, and media management.

**02. TechSight 2026**
- Position: PDD.
- Event: Technology seminar.
- Session: Vibe Coding Pros & Cons: Redefining Software Development in Tech 5.0.
- Activities: Publication, Decoration & Documentation according to actual responsibilities.

**03. Virtuship**
- Program: Telkomsel Virtual Internship.
- Role: Information Technology (IT).
- Learning areas:
  - Application & Software Development.
  - IT Infrastructure & Security.
  - IT Strategy.

### UI Requirements

- Vertical timeline.
- Organization or program name.
- Position and period.
- Short description.
- Optional documentation image.
- Expandable experience details.

### Animation Requirements

- Scroll-triggered reveal.
- Vertical timeline animation.
- Expanding detail cards.
- Active timeline indicator.

Past experiences and responsibilities must be represented accurately. Do not invent achievements or employment status.

---

## SECTION 05 — PROJECT SHOWCASE

### Concept

INDUSTRIAL LOCKER & SLOT MACHINE.

This section is the signature interactive feature of the portfolio.

It combines mechanical typography, industrial locker navigation, and stacked project cards.

### 5.1 Opening Animation

Heading:

SELECT SECTOR

Requirements:

- Heading appears using slot machine text animation.
- Letters move vertically like mechanical reels.
- Letters stop sequentially.
- Three industrial locker doors appear after the heading animation.
- Entrance timing must feel cohesive.

### 5.2 Industrial Locker Navigation

Three locker doors are displayed horizontally.

Each locker contains:
- Industrial steel door appearance.
- Ventilation louvers.
- Mechanical handle.
- Sector identification.
- Frosted-glass category label.
- Subtle lighting details.

### 5.3 Locker Categories

**SEC-01 — SOFTWARE DEVELOPER**

Visual identity:
- Gunmetal.
- Dark charcoal.
- Minimal LED indicators.

Tagline:

"Turning ideas into functional digital experiences."

Core capabilities:
- Software & Application Development.
- Frontend Development.
- Programming & Problem Solving.

Potential projects:
- Roomify.
- Noctis.
- YukJalan!.

**SEC-02 — UI/UX DESIGNER**

Visual identity:
- Slate blue.
- Off-white.
- Subtle technical grid.

Tagline:

"Designing meaningful experiences through thoughtful interfaces."

Core capabilities:
- User Interface Design.
- User Experience Design.
- Wireframing & Prototyping.

Potential projects:
- Roomify UI/UX.
- Noctis UI/UX.
- YukJalan! UI/UX.

**SEC-03 — GRAPHIC DESIGN**

Visual identity:
- Signal orange.
- Deep crimson.
- Industrial stencil typography.

Tagline:

"Communicating ideas through visual storytelling."

Core capabilities:
- Graphic Design & Visual Communication.
- Poster & Digital Design.
- Video Editing & Motion Graphics.

Potential projects:
- Graphic design posters.
- Infographics.
- Event documentation.
- Video bumper and publication materials.

Only include projects and works that have actually been completed or sufficiently developed.

### 5.4 Locker Interaction

**Default State**
- Three locker doors appear side by side.
- All doors are closed.
- Each door displays its sector number and category.

**Hover / Active State**
- Selected locker becomes visually prominent.
- Two other lockers fade into thin outlines.
- Selected door rotates slightly on the Y-axis.
- A subtle light accent appears.
- Display the label CLICK TO ENTER.
- Adjacent information area displays the selected category, tagline, and capabilities.

**Desktop**
- Hover can preview the locker.
- Click selects and enters the category.

**Mobile**
- First tap opens the category preview.
- A separate ENTER button opens the project showcase.
- Do not depend on hover.

### 5.5 Project Card Stack Scroll

After entering a sector, display the projects as a stacked scroll collection.

Card content:
1. Project cover or preview.
2. Project title.
3. Short description.
4. Technology stack or design tools.
5. Personal role and contribution.
6. View Case Study button.
7. GitHub or Live Demo link when available.

### Animation Requirements

- Cards overlap in a controlled stack.
- Scrolling causes the next card to move forward.
- Previous cards scale down or move into the background.
- Add subtle depth and shadow.
- Use smooth spring transitions.
- Maintain a clear beginning and end of the stacked interaction.

Recommended Motion features:
- useScroll.
- useTransform.
- useSpring.
- useMotionValue.
- AnimatePresence where appropriate.

Important:
- Avoid trapping the visitor in an extended scroll animation.
- Preserve normal page scrolling after the stack completes.
- Ensure mobile scrolling remains natural.
- Support reduced-motion preferences.

---

## SECTION 06 — EDUCATION & LEARNING JOURNEY

### Purpose

Menampilkan latar belakang pendidikan dan perjalanan pembelajaran.

### Content

- Institution: Telkom University.
- Degree: S1 Informatika.
- Study period: 2024–present.
- Relevant learning areas.
- Verified certifications, if available.

### UI Requirements

- Timeline layout.
- University information.
- Study period.
- Learning milestones.
- Certification information.

### Animation Requirements

- Timeline reveal.
- Animated milestones.
- Scroll-triggered content.
- Subtle transitions.

Do not display certifications that have not actually been obtained.

---

## SECTION 07 — CONTACT / LET'S CONNECT

### Purpose

Menyediakan jalur komunikasi profesional antara pengunjung dan pemilik portfolio.

### Main Heading

"Have a project in mind? Let's build something meaningful."

### Contact Information

- Personal email.
- LinkedIn.
- GitHub.

### Contact Form Fields

| Field | Type | Required |
|---|---|---|
| Name | Text | Yes |
| Email | Email | Yes |
| Subject | Text | Yes |
| Message | Textarea | Yes |

### Visual Requirements

- Black-and-white theme.
- Minimalist input fields.
- Clear labels.
- Subtle focus states.
- High contrast.
- Animated submit button.

### Form Interaction

**Idle**
- SEND MESSAGE.

**Submitting**
- SENDING...
- Disable duplicate submissions.
- Display a loading indicator.

**Success**
- MESSAGE SENT SUCCESSFULLY.
- Display a success feedback animation.
- Reset the form after successful submission.

**Error**
- MESSAGE COULD NOT BE SENT.
- Display a clear error message.
- Allow retry without losing entered data.

### Resend Integration

Email provider: Resend.

Verified sending domain:
send.ridwanfaiz.web.id

Sender:
no-reply@send.ridwanfaiz.web.id

Recipient:
Personal Gmail address, configured through environment variables.

Reply-To:
The email address entered by the visitor.

Email notification:
Only send notification to the portfolio owner.

Automatic visitor confirmation:
Not required.

Database:
Not required.

### Email Template

Create a branded email notification using React Email.

Email subject format:

[PORTFOLIO] New Message from {name}

Email body must contain:
- Sender name.
- Sender email.
- Subject.
- Message.
- Submission timestamp.

Design:
- Black-and-white.
- Minimalist typography.
- Clear information hierarchy.
- Responsive email layout.
- Reply-friendly formatting.

The visitor's email must be assigned to Reply-To, not used as the From address.

---

# 5. GLOBAL COMPONENTS

The following components should be reusable across the website.

| Component | Responsibility |
|---|---|
| Navbar | Floating pill navigation |
| Footer | Closing section and social links |
| Reveal | Reusable scroll-triggered reveal |
| TextReveal | Typography animation |
| RollingText | Vertical rolling profession text |
| Parallax | Scroll-based image movement |
| InteractivePortrait | Dual image hover transition |
| SkillCard | Skill presentation |
| ExperienceTimeline | Experience timeline |
| LockerDoor | Interactive industrial locker |
| ProjectCard | Project showcase card |
| ProjectStack | Scroll-driven stacked cards |
| ContactForm | Contact form |
| AnimatedButton | Reusable interactive button |

Avoid unnecessary component duplication.

---

# 6. TECHNICAL REQUIREMENTS

## 6.1 Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Motion (Framer Motion) |
| UI Components | shadcn/ui, when useful |
| Icons | Lucide React |
| Validation | Zod |
| Email API | Resend |
| Email Templates | React Email |
| Version Control | Git & GitHub |
| Deployment | Vercel |

## 6.2 Application Architecture

Use Next.js App Router.

Prefer Server Components for static content.

Use Client Components only when interactivity is required, including:
- Scroll-based animations.
- Hover interactions.
- State management.
- Interactive lockers.
- Project stack.
- Contact form submission.

Keep business logic and email processing on the server.

## 6.3 Suggested Folder Structure

```text
portfolio/
├── public/
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── experience/
│   │   └── creative/
│   ├── icons/
│   └── cv/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── sections/
│   │   ├── animations/
│   │   ├── projects/
│   │   ├── contact/
│   │   └── ui/
│   │
│   ├── data/
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   └── education.ts
│   │
│   ├── emails/
│   │   └── ContactNotification.tsx
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── resend.ts
│   │   └── validation.ts
│   │
│   └── types/
│
├── .env.example
├── package.json
└── README.md
```

This is a suggested architecture and may be adjusted based on implementation needs.

---

# 7. DATABASE REQUIREMENTS

No database is required for the initial release.

All portfolio information will be managed using static TypeScript data files.

Examples:
- Skills.
- Projects.
- Experience.
- Education.

Contact form messages will be delivered directly through Resend to the portfolio owner's Gmail inbox.

Do not introduce Supabase, PostgreSQL, authentication, or an admin dashboard unless explicitly required in a future development phase.

---

# 8. SECURITY REQUIREMENTS

Use the frontend-security-coder skill during implementation and the security-audit skill during review.

## 8.1 Frontend Security

- Never expose API keys in client-side code.
- Never use NEXT_PUBLIC_ for Resend API keys.
- Avoid rendering untrusted HTML.
- Validate all user inputs.
- Avoid insecure URL handling.
- Keep dependencies updated.
- Use secure external link attributes when opening new tabs.

## 8.2 Contact Form Security

- Server-side validation using Zod.
- Email format validation.
- Input length restrictions.
- Sanitize user-provided data before rendering it into email templates.
- Rate limiting.
- Spam protection.
- Safe error handling.
- Prevent duplicate submissions.
- Avoid exposing internal server errors to visitors.

## 8.3 Environment Variables

Example:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=
EMAIL_FROM=
```

Use server-side environment variables only.

Never commit `.env.local` or other files containing secrets.

## 8.4 Security Audit

Before deployment:
- Check dependency vulnerabilities.
- Review API routes.
- Review environment variable exposure.
- Test contact form abuse scenarios.
- Verify external link handling.
- Check Content Security Policy requirements where applicable.
- Review security headers.
- Confirm no sensitive information is exposed in client bundles.

---

# 9. PERFORMANCE REQUIREMENTS

The website must remain responsive despite its extensive animation.

Requirements:

1. Optimize all images.
2. Use Next.js Image where appropriate.
3. Lazy-load below-the-fold imagery.
4. Avoid unnecessary client-side JavaScript.
5. Use transform and opacity for animations when possible.
6. Avoid expensive layout recalculations.
7. Limit continuous animation loops.
8. Avoid excessive use of blur and large filters.
9. Test on mobile devices and lower-powered hardware.

Target performance:
- Lighthouse Performance: aim for 90+.
- Accessibility: aim for 90+.
- Best Practices: aim for 90+.
- SEO: aim for 90+.

These are development targets, not guaranteed scores.

---

# 10. RESPONSIVE DESIGN

Support:
- Desktop.
- Laptop.
- Tablet.
- Mobile.

Responsive requirements:

**Desktop**
- Full navigation.
- Hover interactions.
- Full locker animations.
- Side-by-side portrait layout.
- Scroll-driven project stack.

**Tablet**
- Adjusted typography and spacing.
- Responsive locker arrangement.
- Touch-compatible interactions.

**Mobile**
- Compact navigation with tap expansion.
- Single-column About Me.
- Touch-friendly skill cards.
- Responsive timeline.
- Locker preview through tap.
- Explicit ENTER button.
- Natural vertical project card scrolling.
- Reduced decorative animation when necessary.

Do not simply shrink the desktop layout. Adapt each interaction to the device.

---

# 11. ACCESSIBILITY REQUIREMENTS

- Semantic HTML.
- Proper heading hierarchy.
- Keyboard-accessible navigation.
- Visible focus indicators.
- Accessible form labels.
- Sufficient color contrast.
- Descriptive image alt text.
- Reduced-motion support.
- Do not communicate information through color alone.
- Provide keyboard alternatives for hover-dependent interactions.

---

# 12. SEO REQUIREMENTS

Implement:
- Page title.
- Meta description.
- Open Graph metadata.
- Social sharing image.
- Canonical URL.
- Sitemap.
- Robots configuration.
- Descriptive headings.
- Semantic HTML.
- Structured metadata where appropriate.

Suggested page title:

Ridwan Faiz Herlambang | Frontend Developer & Creative Portfolio

Suggested meta description:

Explore the personal portfolio of Ridwan Faiz Herlambang, showcasing software development, frontend engineering, UI/UX design, graphic design, and interactive digital projects.

Domain:
https://ridwanfaiz.web.id

---

# 13. DEVELOPMENT PHASES

## Phase 1 — Foundation

- Initialize Next.js project.
- Configure TypeScript.
- Configure Tailwind CSS.
- Install Motion.
- Establish design tokens.
- Configure fonts.
- Set up project architecture.

## Phase 2 — Global Navigation & Hero

- Build floating pill navigation.
- Implement compact and expanded states.
- Create Hero section.
- Implement rolling text.
- Add background animations.

## Phase 3 — About, Skills & Experience

- Build About Me.
- Implement dual portrait interaction.
- Create skill cards.
- Build experience timeline.

## Phase 4 — Project Showcase

- Build slot machine heading.
- Create industrial locker components.
- Implement locker selection.
- Build category previews.
- Implement project card stack scroll.

## Phase 5 — Education & Contact

- Create education timeline.
- Build Contact section.
- Integrate Resend.
- Create React Email template.
- Test notification delivery.

## Phase 6 — Quality Assurance

- Responsive testing.
- Accessibility testing.
- Performance optimization.
- Security audit.
- SEO implementation.
- Deployment to Vercel.

---

# 14. ACCEPTANCE CRITERIA

The project is considered ready for release when the following requirements are met.

## Navigation
- [ ] Floating pill appears consistently.
- [ ] Navbar becomes compact when scrolling.
- [ ] Navbar expands on hover.
- [ ] Navigation links lead to correct sections.
- [ ] Active section indicator works.
- [ ] Mobile navigation works through touch.

## Hero
- [ ] PORTFOLIO heading displays correctly.
- [ ] Rolling profession animation works.
- [ ] All four professions are displayed.
- [ ] Background animation does not interfere with readability.

## About Me
- [ ] Correct default portrait appears.
- [ ] Hover switches to the almamater portrait.
- [ ] Image returns to default on pointer exit.
- [ ] Mobile interaction works.

## Skills
- [ ] All skill categories appear.
- [ ] Cards have working interactions.
- [ ] No misleading skill percentages.

## Experience
- [ ] All relevant experiences appear.
- [ ] Timeline animation works.
- [ ] Experience details are accurate.

## Projects
- [ ] Three locker sectors appear.
- [ ] Hover and active states work.
- [ ] Locker selection works.
- [ ] Mobile tap interaction works.
- [ ] Project card stack works.
- [ ] Each project displays accurate information.

## Education
- [ ] University and degree information appears.
- [ ] Timeline is responsive.
- [ ] Certifications are accurate.

## Contact
- [ ] Form validates all required fields.
- [ ] Resend successfully delivers email to the owner's Gmail.
- [ ] Reply-To points to the visitor's email.
- [ ] Email uses the approved black-and-white template.
- [ ] No automatic confirmation email is sent.
- [ ] Loading, success, and error states work.
- [ ] No duplicate submission.

## Quality
- [ ] Mobile and desktop layouts work.
- [ ] No critical console errors.
- [ ] No exposed secrets.
- [ ] Security audit completed.
- [ ] Reduced-motion support works.
- [ ] Production deployment works.

---

# 15. DEVELOPMENT GUIDELINES FOR AI CODING AGENTS

The following instructions must be followed when implementing this project.

1. Treat this PRD as the primary source of truth.
2. Do not replace the established design direction with a generic portfolio template.
3. Preserve the black-and-white visual identity.
4. Prioritize the specified interactions and animation behavior.
5. Build reusable components instead of duplicating logic.
6. Keep components maintainable and appropriately separated.
7. Use TypeScript with clear type definitions.
8. Avoid unnecessary dependencies.
9. Do not introduce a database without explicit approval.
10. Do not invent personal information, achievements, project details, or certifications.
11. Use placeholder content only when actual assets or information are not yet available.
12. Do not fabricate project screenshots or claim that unfinished projects are completed.
13. Implement responsive behavior from the beginning.
14. Follow frontend security best practices.
15. Run security and quality checks before deployment.
16. Do not sacrifice usability and accessibility for visual effects.
17. Test each major feature before moving to the next development phase.

## Skill Utilization

**Impeccable**
- Design direction.
- Visual consistency.
- UI hierarchy.
- Layout refinement.
- Interaction design.
- Responsive design review.

**frontend-security-coder**
- Secure frontend implementation.
- Safe handling of user input.
- Secure API integration.
- Environment variable protection.

**security-audit**
- Dependency review.
- Vulnerability assessment.
- API security review.
- Production readiness audit.

Skills should be used according to their actual capabilities and instructions.

---

# 16. FINAL PRODUCT VISION

The final product should be a distinctive personal portfolio that combines modern frontend engineering with creative visual presentation.

The website should feel:
- Professional.
- Minimalist.
- Interactive.
- Modern.
- Technically sophisticated.
- Visually consistent.
- Easy to navigate.

The industrial locker showcase should become the portfolio's signature experience, while the rest of the website maintains a clean black-and-white editorial design.

**Final Design Philosophy:**

"Less visual noise, more meaningful interaction."

The objective is not to create the portfolio with the most animations, but to create an experience where every animation, transition, and interaction contributes to the identity and usability of the website.

**END OF DOCUMENT**