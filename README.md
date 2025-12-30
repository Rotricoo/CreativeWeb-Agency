# Creative Web Agency

A modern, responsive digital agency website built as an educational project for the **Front-end Development course at EBAC (Responsive Websites module)**. The goal is to practice advanced layout techniques, interactive components, and clean front-end architecture.

---

## About This Project

This project started as a class assignment and was expanded to explore more advanced front-end concepts than the original brief required.  
The focus is to simulate a real digital agency website with:

- Clear information hierarchy
- Strong visual identity
- Interactive elements that feel professional and polished
- Fully responsive behavior across different screen sizes

The site is structured as a single-page experience with sections for hero, about, services, testimonials, and contact.

---

## Main Features

### Core Experience

- **Responsive Navigation**: Header with primary links and a clear call-to-action
- **Hero Section**: High-impact headline, supporting text and main CTA buttons
- **Behind the Brand Section**: Grid highlighting leadership, team, and key case studies
- **How We Can Help Section**: Interactive services carousel with dynamic details
- **Testimonials**: Short quotes from fictional clients to reinforce credibility
- **Contact Section**: Contact details and an integrated contact form

---

### UI & UX

- **Design System**  
  Centralized CSS variables for colors, typography, spacing and shadows, making it easier to maintain consistency across the entire site.

- **Gradient-Driven Visual Style**  
  Animated gradients on buttons and service cards create a modern, premium aesthetic that captures attention.

- **Fluid Layout**  
  Combination of Flexbox and CSS Grid to adapt content to different viewports without breaking the structure or user experience.

- **Micro-Interactions**  
  Smooth transitions on hover states, cards, and content changes in the services section make the interface feel polished and responsive.

---

### Interactive Components

- **Services Carousel**  
  A custom JavaScript carousel that:

  - Highlights the active service card with distinctive styling
  - Adjusts opacity and scale of neighboring cards to create visual depth
  - Updates a detailed information panel with icon, description and bullet points for each service in real-time

- **Team Member Modals**  
  "+" buttons on team member cards open a modal displaying:

  - Professional photo, name and role
  - Short professional highlight text
  - Bullet points showcasing skills and expertise

- **Portfolio Modal**  
  A dedicated modal for the "Explore Portfolio" call-to-action, currently showing a "portfolio under construction" message and prepared for future expansion.

- **Service Details Modal**  
  An informational modal linked to the services section, designed to display detailed case studies and service information in the future.

All interactive behavior is implemented with **vanilla JavaScript** (no external dependencies).

---

### Responsiveness

- **Breakpoint-Driven Layout**  
  Main breakpoint around `900px` adapts the design from desktop to tablet/mobile:

  - Header spacing and navigation restructured for smaller screens
  - Hero text and buttons realigned for optimal readability on narrow viewports
  - Services section reflows seamlessly, keeping the carousel and details usable on all devices

- **Flexible Typography & Spacing**  
  Font sizes and spacing are built on a modular `rem`-based scale, ensuring consistent readability across all screen sizes and resolutions.

---

## Technologies Used

- **HTML5** – Semantic markup with structured sections for hero, about, services, testimonials and contact
- **CSS3** –
  - CSS Variables (custom properties) for maintainable theming
  - Flexbox and Grid for modern, responsive layouts
  - Transitions and keyframe animations for smooth gradients and content changes
  - Media Queries for mobile-first responsive design
- **JavaScript (ES6+)** –
  - Modular code split into focused files (`script.js` and `solutions.js`)
  - Efficient DOM manipulation and event handling
  - Dynamic content updates (carousel states, modal management, real-time details)

---

## Project Structure

```bash
Creative-Web-Agency/
├── index.html          # Main page
├── README.md           # Project documentation
├── CSS/
│   ├── reset.css       # CSS reset for consistent cross-browser styling
│   └── styles.css      # Complete theme, layout and animations
├── JS/
│   ├── script.js       # Navigation, team modals and general interactions
│   └── solutions.js    # Services carousel and service modal logic
└── Assets/
    ├── Icons/          # Service and brand icons
    └── Images/         # Team photos and project showcases
```

---

## Design & Architecture Decisions

### Separation of Responsibilities

- `script.js` handles:
  - Header / navigation behavior
  - Team (members) modal logic
  - Portfolio modal behavior
- `solutions.js` handles:
  - Services carousel states and animations
  - Dynamic update of the services details panel
  - Service modal logic

This separation keeps the code easier to read and maintain, especially as the project grows.

---

### Styling & Layout

- **CSS Variables** for colors, typography and spacing to avoid repetition and improve consistency.
- **Reusable Components** such as primary buttons (`.bt-large`), secondary buttons (`.bt-small`) and cards.
- **Animated Gradients** used in key areas (hero CTA, services, detail card) to reinforce a cohesive visual language.

---

## License

This project is open source and available under the **MIT License**.
