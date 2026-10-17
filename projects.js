// Public GitHub project explorer. No API key or placeholder statistics.
(() => {
  'use strict';
  const USERNAME = 'Nijenth';
  const search = document.getElementById('repo-search');
  const language = document.getElementById('language-filter');
  const sort = document.getElementById('sort-repos');
  const grid = document.getElementById('repo-grid');
  const resultsLabel = document.getElementById('repo-results-label');
  const empty = document.getElementById('repo-empty');
  const alertBox = document.getElementById('repo-alert');
  const errorText = document.getElementById('repo-error-text');
  const retryButton = document.getElementById('retry-repos');
  const resetButton = document.getElementById('clear-filters');
  const emptyReset = document.getElementById('empty-reset');
  let repositories = [];
  let loading = false;

  const externalLink = (href, text, className = '') => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = className;
    anchor.textContent = text;
    return anchor;
  };

  const formatNumber = value => new Intl.NumberFormat('en-US').format(value);
  const lastUpdated = timestamp => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'Update date unavailable';
    return `Updated ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)}`;
  };

  function safeUrl(value) {
    if (!value || typeof value !== 'string') return null;
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch { return null; }
  }

  function makeCard(repo) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const top = document.createElement('div');
    top.className = 'repo-card-top';
    const mark = document.createElement('span');
    mark.className = 'repo-mark';
    mark.textContent = '</>';
    mark.setAttribute('aria-hidden', 'true');
    const visibility = document.createElement('span');
    visibility.className = 'repo-public-label';
    visibility.textContent = 'PUBLIC REPOSITORY';
    top.append(mark, visibility);

    const h3 = document.createElement('h3');
    const sourceUrl = `https://github.com/${USERNAME}/${encodeURIComponent(repo.name)}`;
    h3.append(externalLink(sourceUrl, repo.name));

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description provided on GitHub.';

    const facts = document.createElement('div');
    facts.className = 'repo-facts';
    const lang = document.createElement('span');
    const dot = document.createElement('i');
    dot.className = 'repo-lang-dot';
    dot.dataset.language = repo.language || 'Unspecified';
    dot.setAttribute('aria-hidden', 'true');
    lang.append(dot, document.createTextNode(repo.language || 'Unspecified'));
    const stars = document.createElement('span');
    stars.setAttribute('aria-label', `${repo.stargazers_count} stars`);
    stars.textContent = `★ ${formatNumber(repo.stargazers_count)}`;
    const forks = document.createElement('span');
    forks.setAttribute('aria-label', `${repo.forks_count} forks`);
    forks.textContent = `⑂ ${formatNumber(repo.forks_count)}`;
    facts.append(lang, stars, forks);

    const date = document.createElement('div');
    date.className = 'repo-date';
    date.textContent = lastUpdated(repo.updated_at);

    const links = document.createElement('div');
    links.className = 'repo-links';
    links.append(externalLink(sourceUrl, 'Source code ↗'));
    const demo = safeUrl(repo.homepage);
    if (demo) links.append(externalLink(demo, 'Live demo ↗'));

    card.append(top, h3, description, facts, date, links);
    return card;
  }

  function render() {
    if (loading) return;
    const query = search.value.trim().toLocaleLowerCase();
    const selectedLanguage = language.value;
    let filtered = repositories.filter(repo => {
      const matchesText = [repo.name, repo.description || '', ...(repo.topics || [])].join(' ').toLocaleLowerCase().includes(query);
      return matchesText && (selectedLanguage === 'all' || (repo.language || 'Unspecified') === selectedLanguage);
    });

    if (sort.value === 'stars') filtered.sort((a,b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at));
    else if (sort.value === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
    else filtered.sort((a,b) => b.updated_at.localeCompare(a.updated_at));

    grid.replaceChildren();
    const fragment = document.createDocumentFragment();
    filtered.forEach(repo => fragment.append(makeCard(repo)));
    grid.append(fragment);
    grid.setAttribute('aria-busy', 'false');
    empty.hidden = filtered.length > 0;
    resultsLabel.textContent = `Showing ${filtered.length} of ${repositories.length} public ${repositories.length === 1 ? 'repository' : 'repositories'}`;
    if (repositories.length === 0) {
      empty.querySelector('h3').textContent = 'No public repositories yet.';
      empty.querySelector('p').textContent = 'Public repositories will appear here automatically once published on GitHub.';
    } else {
      empty.querySelector('h3').textContent = 'No matching repositories.';
      empty.querySelector('p').textContent = 'Try another search or select a different language.';
    }
  }

  function populateLanguages() {
    language.replaceChildren(new Option('All languages', 'all'));
    const languages = [...new Set(repositories.map(repo => repo.language || 'Unspecified'))].sort((a,b) => a.localeCompare(b));
    languages.forEach(name => language.add(new Option(name, name)));
  }

  async function fetchRepositories() {
    const all = [];
    // GitHub's public API paginates results at 100 per page.
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner&sort=updated`;
      const response = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) throw new Error('GitHub is temporarily rate-limiting public API requests. Please try again later or use the GitHub profile link.');
        throw new Error(`GitHub returned an error (${response.status}). Please try again.`);
      }
      const pageItems = await response.json();
      if (!Array.isArray(pageItems)) throw new Error('GitHub returned an unexpected response.');
      all.push(...pageItems);
      if (pageItems.length < 100) break;
    }
    return all.filter(item => !item.private && typeof item.name === 'string' && item.owner?.login?.toLowerCase() === USERNAME.toLowerCase())
      .map(item => ({
        name: item.name,
        description: typeof item.description === 'string' ? item.description : '',
        language: typeof item.language === 'string' ? item.language : null,
        stargazers_count: Number.isSafeInteger(item.stargazers_count) ? item.stargazers_count : 0,
        forks_count: Number.isSafeInteger(item.forks_count) ? item.forks_count : 0,
        updated_at: typeof item.updated_at === 'string' ? item.updated_at : '',
        homepage: item.homepage,
        topics: Array.isArray(item.topics) ? item.topics.filter(v => typeof v === 'string') : []
      }));
  }

  async function load() {
    if (loading) return;
    loading = true;
    retryButton.disabled = true;
    alertBox.hidden = true;
    empty.hidden = true;
    grid.setAttribute('aria-busy', 'true');
    resultsLabel.textContent = 'Connecting to GitHub…';
    try {
      repositories = await fetchRepositories();
      populateLanguages();
      loading = false;
      render();
    } catch(error) {
      loading = false;
      grid.replaceChildren();
      grid.setAttribute('aria-busy', 'false');
      alertBox.hidden = false;
      errorText.textContent = error.message || 'Please try again in a moment.';
      resultsLabel.textContent = 'GitHub data unavailable';
    } finally {
      retryButton.disabled = false;
    }
  }

  function resetFilters() {
    search.value = '';
    language.value = 'all';
    sort.value = 'updated';
    render();
  }

  search.addEventListener('input', render);
  language.addEventListener('change', render);
  sort.addEventListener('change', render);
  resetButton.addEventListener('click', resetFilters);
  emptyReset.addEventListener('click', resetFilters);
  retryButton.addEventListener('click', load);
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    event.preventDefault();
    search.focus();
  });
  load();
})();
