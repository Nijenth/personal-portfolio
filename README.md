# Nijenth — Frontend Developer Portfolio (v2)

A responsive personal portfolio featuring selected frontend projects. Built with **HTML, CSS, and vanilla JavaScript** for straightforward maintenance and GitHub Pages hosting.

**Live portfolio:** https://nijenth.github.io/personal-portfolio/

## What changed from v1

- Replaced broad AI-engineering, full-stack and skill-percentage claims with a focused frontend introduction.
- Featured **AutomateX**, **VibeStore**, and **NeuralFlow AI**, with links to their actual source repositories.
- Removed the GitHub API project feed and its invented fallback star/fork statistics.
- Removed the contact form that previously only simulated success. The new contact CTA opens an email draft (`mailto:`); it does not claim to send a message automatically.
- Kept the dark visual direction while replacing the page structure and styles with a more focused, responsive portfolio.
- Added keyboard-friendly navigation, reduced-motion support, progressive enhancement for scroll effects, and clearer project-scope wording.

## Featured projects

| Project | Type | Links |
| --- | --- | --- |
| **AutomateX** | React + TypeScript agency landing page concept | [Live demo](https://nijenth.github.io/automatex-landing/) · [Source](https://github.com/Nijenth/automatex-landing) |
| **VibeStore** | React + TypeScript product-list demo | [Source](https://github.com/Nijenth/vibestore) |
| **NeuralFlow AI** | HTML/CSS/JS startup landing page concept | [Source](https://github.com/Nijenth/ai-startup-landing-page) |

These are **independent frontend learning/portfolio projects**, not commissioned client work or working AI backend products.

## Project visuals

- The AutomateX panel is a **self-contained CSS mockup** to illustrate the category of work. It is NOT a real screenshot of that application.
- The VibeStore and NeuralFlow panels are also **decorative illustrations**, not screenshots of those applications. Replace them with real captures for stronger credibility.
- No project images are loaded from external servers. The CSS illustrations work offline.

## Files

```text
personal-portfolio/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Preview locally

Open the folder in Cursor and right-click `index.html` → **Open with Live Server**. No Node.js, npm, Vite, or build step is needed.

## Publish on GitHub Pages

This is a static website. Once you're happy with the local version:

```powershell
git add index.html style.css script.js README.md
git commit -m "Refresh frontend portfolio v2"
git push origin main
```

The existing GitHub Pages deployment should update if the repository is already configured to publish from `main` / root. If it uses a different source, follow the repository's Pages settings.

## Contact

**Email:** [nijenth11@gmail.com](mailto:nijenth11@gmail.com)  
**GitHub:** [Nijenth](https://github.com/Nijenth)
