# 🌌 Nijenth's Personal Portfolio

A premium, interactive, and responsive portfolio website showcasing my work, skills, and journey as a **Creative AI Engineer**. Built using modern design aesthetics, smooth interactions, and dynamic integrations.

🌐 **Live Demo:** [Nijenth's Portfolio](https://github.com/Nijenth/personal-portfolio) *(Update with your deployed link, e.g., GitHub Pages)*

---

## ✨ Features

- **Modern Glassmorphic Design:** A visually striking aesthetic featuring ambient gradient glow orbs, sleek layout components, and custom typewriter text effects.
- **Dynamic GitHub Repository Fetching:** Automatically queries the GitHub API to showcase my latest projects, complete with statistics (stars/forks), language indicators, search filtration, and fallback configurations in case of rate limits.
- **Interactive Tech Stack Cards:** Incorporates interactive code snippet representations and smooth, high-fidelity card layouts.
- **Scroll Reveal Animations:** Powered by `IntersectionObserver` to reveal content gracefully as the user scrolls.
- **Responsive & Accessible Navigation:** A modern header navigation bar that shrinks on scroll and collapses into a responsive sidebar menu for mobile screens.
- **Contact Form Simulation:** A styled contact form with instant validation, simulated request handling, and user feedback animations.

---

## 🛠️ Technology Stack

- **Frontend Core:** HTML5, Modern Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid), and Vanilla JavaScript (ES6+).
- **Icons & Fonts:** [Lucide Icons](https://lucide.dev/) for clean vector icons and [Google Fonts](https://fonts.google.com/) (Outfit & Inter) for typography.
- **API Integrations:** [GitHub REST API](https://docs.github.com/en/rest) for real-time portfolio projects ingestion.

---

## 🚀 Getting Started

To run this project locally, follow these simple steps:

### Prerequisites

You only need a modern web browser to run the static site.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Nijenth/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Open the Project:**
   Simply double-click `index.html` to open it in your default web browser, or serve it locally using a development server (e.g., Live Server in VS Code).

---

## 📁 Project Structure

```text
personal-portfolio/
├── index.html       # Main HTML document outlining structure & accessibility tags
├── style.css        # Responsive stylesheet with global variables, gradients, and custom components
├── script.js       # Handles mobile menu, scroll reveal, GitHub API fetching, search/filter, and form handlers
└── README.md        # This detailed project documentation
```

---

## 🎨 Customizing the Portfolio

### Changing the GitHub Username
To display your own projects, open [script.js](file:///c:/Users/NIJENTH/personal-portfolio/script.js) and update the `username` constant at line 93:
```javascript
const username = 'YourGitHubUsername';
```

### Modifying Your Fallback Projects
If the API rate limit is reached, a set of high-quality fallback projects is displayed. You can customize this list in [script.js](file:///c:/Users/NIJENTH/personal-portfolio/script.js) starting at line 120 (`fallbackProjects`).

---

## 📬 Connect with Me

- **Email:** [nijenth11@gmail.com](mailto:nijenth11@gmail.com)
- **GitHub:** [@Nijenth](https://github.com/Nijenth)

---
*Created with ❤️ by Nijenth*
