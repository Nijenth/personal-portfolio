document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            const iconName = isOpen ? 'x' : 'menu';

            // Toggle icon
            mobileToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
            lucide.createIcons();
        });

        // Close menu when clicking link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.innerHTML = `<i data-lucide="menu"></i>`;
                lucide.createIcons();
            });
        });
    }

    // --- Header Scroll Effect & Active Section ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(7, 6, 20, 0.9)';
            header.style.padding = '0.2rem 0';
        } else {
            header.style.background = 'rgba(7, 6, 20, 0.6)';
            header.style.padding = '0';
        }
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, activeObserverOptions);

    sections.forEach(section => activeObserver.observe(section));

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));

    // --- GitHub Repos API Integration ---
    const username = 'Nijenth';
    const projectsGrid = document.getElementById('projectsGrid');
    const projectSearch = document.getElementById('projectSearch');
    const filterContainer = document.getElementById('filterContainer');
    const projectDescription = document.querySelector('#projects .section-description');

    let allProjects = [];

    // Language color mapping
    const langColors = {
        python: '#3572A5',
        javascript: '#f1e05a',
        html: '#e34c26',
        css: '#563d7c',
        typescript: '#3178c6',
        notebook: '#DA5B0B',
        jupyter: '#DA5B0B',
        shell: '#89e051'
    };

    // Helper: title case repository names
    function cleanRepoName(name) {
        return name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    // Static Fallback Projects (in case rate limit is hit or network is offline)
    const fallbackProjects = [
        {
            name: 'automatex-landing',
            cleanName: 'AutomateX Landing Page',
            description: 'A responsive automation agency landing page built with React and TypeScript.',
            language: 'TypeScript',
            stars: null,
            forks: null,
            githubUrl: 'https://github.com/Nijenth/automatex-landing',
            homepage: 'https://nijenth.github.io/automatex-landing/',
            isFallback: true
        },
        {
            name: 'vibestore',
            cleanName: 'VibeStore',
            description: 'A React and TypeScript product-list demo with search, product management, and cart interactions.',
            language: 'TypeScript',
            stars: null,
            forks: null,
            githubUrl: 'https://github.com/Nijenth/vibestore',
            homepage: null,
            isFallback: true
        },
        {
            name: 'ai-startup-landing-page',
            cleanName: 'NeuralFlow AI Landing Page',
            description: 'A responsive startup landing page concept built using HTML, CSS, and JavaScript.',
            language: 'HTML',
            stars: null,
            forks: null,
            githubUrl: 'https://github.com/Nijenth/ai-startup-landing-page',
            homepage: null,
            isFallback: true
        }
    ];

    // Fetch repositories
    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            const data = await response.json();

            // Map GitHub response to custom project format
            allProjects = data
                .filter(repo => !repo.fork) // Exclude forks
                .map(repo => ({
                    name: repo.name,
                    cleanName: cleanRepoName(repo.name),
                    description: repo.description || 'No description available for this repository.',
                    language: repo.language || 'Unknown',
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    githubUrl: repo.html_url,
                    homepage: repo.homepage
                }));

            // Fallback to static if no public repos returned
            if (allProjects.length === 0) {
                allProjects = fallbackProjects;
            }
        } catch (error) {
            console.warn('GitHub API failed, using high-quality local projects fallback:', error);
            allProjects = fallbackProjects;
        } finally {
            if (projectDescription) {
                const showingFallback = allProjects.some(project => project.isFallback);

                projectDescription.textContent = showingFallback
                    ? 'Showing saved project information (not live GitHub data).'
                    : 'Dynamically pulled directly from my GitHub profile.';
            }

            renderProjects(allProjects);
            generateFilterButtons(allProjects);
        }
    }

    // Render projects list in grid
    function renderProjects(projectsToRender) {
        projectsGrid.innerHTML = '';

        if (projectsToRender.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects-message" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    <i data-lucide="info" style="margin: 0 auto 1rem; width: 36px; height: 36px; display: block; color: var(--color-secondary);"></i>
                    <p>No projects match your current filters. Try searching for something else!</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        projectsToRender.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card scroll-reveal revealed';
            // Slight staggered animation delay for cards
            card.style.transitionDelay = `${index * 0.05}s`;

            const langLower = project.language.toLowerCase();
            const dotColor = langColors[langLower] || '#9ca3af';

            const homeLinkHTML = project.homepage
                ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="project-icon-link" aria-label="Live Demo"><i data-lucide="external-link"></i></a>`
                : '';

            card.innerHTML = `
                <div>
                    <div class="project-header">
                        <div class="project-icon-box">
                            <i data-lucide="folder"></i>
                        </div>
                        <div class="project-link-box">
                            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-icon-link" aria-label="GitHub Repository">
                                <i data-lucide="github"></i>
                            </a>
                            ${homeLinkHTML}
                        </div>
                    </div>
                    <h3 class="project-title">${project.cleanName}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
                <div class="project-footer">
                    <div class="project-lang">
                        <span class="lang-dot" style="background-color: ${dotColor}"></span>
                        <span class="lang-text">${project.language}</span>
                    </div>
                    <div class="project-stats">
                        ${Number.isFinite(project.stars) ? `
                            <span class="stat-val" title="Stars">
                                <i data-lucide="star"></i> ${project.stars}
                            </span>
                        ` : ''}
                        ${Number.isFinite(project.forks) ? `
                            <span class="stat-val" title="Forks">
                                <i data-lucide="git-fork"></i> ${project.forks}
                            </span>
                        ` : ''}
                    </div>
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        // Initialize icons inside new cards
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Dynamic Filter Categories generation
    function generateFilterButtons(projects) {
        // Find all unique languages present, filter out duplicates/blanks
        const languages = new Set();
        projects.forEach(p => {
            if (p.language && p.language !== 'Unknown') {
                languages.add(p.language);
            }
        });

        // Clear existing custom buttons (keep 'All' button)
        filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';

        languages.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', lang.toLowerCase());
            btn.textContent = lang;
            filterContainer.appendChild(btn);
        });

        // Re-attach listeners to filter buttons
        setupFilterListeners();
    }

    // Search and Filter logic orchestration
    function filterAndSearchProjects() {
        const query = projectSearch.value.toLowerCase().trim();
        const activeFilterBtn = filterContainer.querySelector('.filter-btn.active');
        const selectedLang = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        const filtered = allProjects.filter(p => {
            const matchesSearch = p.cleanName.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
            const matchesLang = selectedLang === 'all' || p.language.toLowerCase() === selectedLang;
            return matchesSearch && matchesLang;
        });

        renderProjects(filtered);
    }

    function setupFilterListeners() {
        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                filterAndSearchProjects();
            });
        });
    }

    if (projectSearch) {
        projectSearch.addEventListener('input', filterAndSearchProjects);
    }

    // Initialize Projects loading
    fetchGitHubRepos();

    // --- Netlify Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('span');

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Prevent duplicate submissions
            if (submitButton.disabled) return;

            submitButton.disabled = true;
            buttonText.textContent = 'Sending...';

            formMessage.textContent = '';
            formMessage.className = 'form-message';

            try {
                const formData = new FormData(contactForm);

                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData).toString()
                });

                if (!response.ok) {
                    throw new Error(`Submission failed: ${response.status}`);
                }

                // Only show success after successful HTTP response
                formMessage.textContent = 'Your message has been submitted successfully!';
                formMessage.className = 'form-message success';
                contactForm.reset();
            } catch (error) {
                console.error('Contact form error:', error);
                formMessage.textContent = 'Unable to send your message. Please try again.';
                formMessage.className = 'form-message error';
            } finally {
                submitButton.disabled = false;
                buttonText.textContent = 'Send Message';
            }
        });
    }
});