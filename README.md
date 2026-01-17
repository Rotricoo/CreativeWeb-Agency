# Creative Web Agency

A modern, responsive digital agency website showcasing professional front-end development practices. Built as an educational project for the **Front-end Development course at EBAC**, this site demonstrates advanced layout techniques, interactive components, and clean CSS architecture using the **BEM methodology** with **SCSS**.

---

## About This Project

This project started as a class assignment and was expanded to explore more advanced front-end concepts than the original brief required. It has been completely refactored using the **BEM (Block, Element, Modifier) methodology** for CSS architecture, with a modern **SCSS** workflow for maintainability and scalability.

The site is structured as a single-page experience with sections for hero, about, services, team, and contact. It features a responsive scroll-snap architecture optimized for mobile, tablet, and desktop viewports.

---

## Main Features

### SCSS Architecture & BEM Refactoring

**All CSS has been refactored to SCSS with BEM (Block, Element, Modifier) standards**, ensuring:

- ✅ **Modular Organization**: CSS split into 23 partial files by responsibility (variables, mixins, components, sections, media queries)
- ✅ **SCSS Mixins & Functions**: Reusable utilities for gradients, flexbox centering, buttons, and modals
- ✅ **CSS Variables**: Design tokens for colors, typography, spacing, z-index, and widths
- ✅ **Consistency**: Predictable BEM naming convention across 127+ classes
- ✅ **Scalability**: Easy to add new components without conflicts
- ✅ **Maintainability**: Clear structure with organized breakpoint-specific media queries
- ✅ **Low Specificity**: Single-class selectors prevent CSS conflicts

### Responsive Scroll-Snap Architecture

- **Mobile-First Design** (≤740px):
  - Hidden sidebar navigation (revealed via dot indicator)
  - 1rem lateral margins for comfortable spacing
  - One section per viewport (scroll-snap mandatory)
  - Testimonials hidden on small screens
- **Tablet Portrait** (741–1100px):
  - Sidebar still hidden
  - Extra padding for better mobile-to-tablet transition
  - Responsive typography scaling
- **Tablet Landscape** (1024–1366px):
  - Sidebar begins to show
  - Adjusted grid layouts for wider screens
- **Desktop** (>1366px):
  - Full sidebar navigation visible
  - Expanded layout with maximum spacing
  - All components at full visual impact

### Core Experience

- **Responsive Navigation**: Fixed sidebar with animated dot indicator
- **Hero Section**: High-impact headline with CTA buttons
- **Team Section**: Grid with interactive member modals showing details and expertise
- **Solutions Section**: Dynamic carousel with service cards and real-time details panel
- **Contact Section**: Contact form with validation and footer

### Interactive Components

- **Services Carousel**: Custom JavaScript carousel with `.solutions__card--active` modifier
- **Team Member Modals**: Photo, role, bio, and professional highlights
- **Portfolio Modal**: "Coming soon" placeholder for future expansion
- **Contact Form**: Client-side validation with success messaging

---

### iOS & Cross-Browser Optimization

- **100svh (Small Viewport Height)** instead of 100vh for iOS Safari compatibility
- **Native Dialog API** for accessible modal management with fallbacks
- **Focus Management** for keyboard navigation and screen reader accessibility

---

## Technologies Used

- **HTML5** – Semantic markup with scroll-snap sections, ARIA labels, and accessibility attributes
- **SCSS** –
  - **BEM Methodology** for organized, scalable CSS architecture
  - **23 partial files** organized by responsibility (variables, mixins, components, sections, media queries)
  - **CSS Variables** (custom properties) for maintainable theming
  - **SCSS Mixins** for reusable utilities (flex-center, gradients, buttons, modals)
  - **Nested Selectors** for cleaner syntax and better organization
  - **Media Queries** for responsive design (breakpoints at 740px, 741–1100px, 1024–1366px)
  - **Scroll-Snap Properties** (`scroll-snap-type`, `scroll-snap-align`) for smooth viewport navigation

- **JavaScript (ES6+)** –
  - Modular code split into focused files by feature
  - Efficient DOM manipulation and event handling
  - Dynamic content updates (carousel states, modal management)
  - IntersectionObserver API for active section detection
  - Focus management for accessibility compliance

---

## Project Structure

```bash
Creative-Web-Agency/
├── index.html                          # Main page with scroll-snap sections
├── README.md                           # Project documentation
├── CSS/
│   └── styles.css                      # Compiled CSS from SCSS
├── SCSS/
│   ├── mainly.scss                     # Main entry point (imports all partials)
│   ├── _var.scss                       # Design tokens (colors, spacing, typography)
│   ├── _global.scss                    # Body and HTML global styles
│   ├── _reset.scss                     # CSS reset for cross-browser consistency
│   ├── _mixins.scss                    # Reusable SCSS mixins and functions
│   ├── snaps/
│   │   ├── _snap-container.scss        # Scroll container with mandatory Y-axis snap
│   │   └── _snap-section.scss          # Individual scroll-snap sections
│   ├── sections/
│   │   ├── _nav-sidebar.scss           # Fixed sidebar navigation
│   │   ├── _hero-section.scss          # Hero landing section
│   │   ├── _team-section.scss          # Team grid and member cards
│   │   ├── _solution-section.scss      # Services carousel and details panel
│   │   └── _contact-section.scss       # Contact form and footer
│   ├── compo/
│   │   ├── _buttons.scss               # Button variants (.btn--sm, .btn--lg)
│   │   └── _modals.scss                # Dialog/modal components
│   └── medias/
│       ├── _media-740px.scss           # Mobile breakpoint (≤740px)
│       └── _media-741px-1100px.scss    # Tablet portrait & landscape
├── JS/
│   ├── contact-form.js                 # Contact form validation and messaging
│   ├── nav-sidebar.js                  # Sidebar navigation and active indicator
│   ├── solutions-section.js            # Services carousel and solution modals
│   ├── team-section.js                 # Team member and portfolio modals
│   ├── bg-canvas.js                    # Canvas background animation
│   ├── cursor.js                       # Custom cursor behavior
│   └── script.js                       # General page interactions
└── Assets/
    ├── Icons/                          # Service and brand icons
    └── Images/                         # Team photos and project showcases
```

---

## Design & Architecture Decisions

### BEM Naming Convention

All CSS classes follow the **BEM (Block, Element, Modifier)** pattern:

**Examples in this project:**

- `.nav-sidebar`, `.nav-sidebar__link`, `.nav-sidebar__dot--active`
- `.hero`, `.hero__title`, `.hero__logo--mobile`
- `.team`, `.team__card`, `.team__card--small`
- `.solutions`, `.solutions__card`, `.solutions__card--active`
- `.contact`, `.contact__form--text`, `.contact__form--btn`
- `.btn`, `.btn--primary`, `.btn--lg`
- `.snap-container`, `.snap-section`

## CSS Architecture Metrics

| Metric                   | Value                                       |
| ------------------------ | ------------------------------------------- |
| **SCSS Partial Files**   | 23                                          |
| **Total CSS Lines**      | ~1,400+                                     |
| **BEM Classes**          | 127+                                        |
| **CSS Variables**        | 23                                          |
| **Breakpoints**          | 4 (740px, 741-1100px, 1024-1366px, desktop) |
| **Average Specificity**  | (0,1,0) - Low                               |
| **Scroll-Snap Sections** | 4 (hero, team, solutions, contact)          |

---

## Learning Outcomes

This project demonstrates:

- **SCSS/CSS Preprocessing** with modular architecture
- **BEM CSS Methodology** for scalable, maintainable stylesheets
- **Responsive Web Design** with mobile-first approach and scroll-snap
- **CSS Variables** for dynamic theming
- **CSS Grid & Flexbox** for modern layouts
- **JavaScript DOM Manipulation** without frameworks
- **Accessibility (A11y)** with ARIA labels and keyboard navigation
- **Semantic HTML5** markup
- **Git & GitHub** workflow for version control
- **Cross-Browser Optimization** for iOS, Android, and desktop

---

## License

This project is open source and available under the **MIT License**.
