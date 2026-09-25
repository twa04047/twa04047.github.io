import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { renderVehicleBlock } from './vehicle-case-study.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lines = v => escape(v).replaceAll('\n', '<br>');
const md = new MarkdownIt({ html: false, linkify: true });
const isLocalMedia = value => /^media\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..');
const resourceHref = value => isLocalMedia(value) ? `../../../${value}` : value;
const recognitionBadge = (project, lang) => project.recognition ? `<p class="publication-badge recognition-badge">${escape(project.recognition[lang])}</p>` : '';

// Standalone Markdown images become captioned figures; adjacent images form a pair.
function renderArticle(tokens, lang, slug) {
  let html = '';
  for (let i = 0; i < tokens.length; i++) {
    if (slug === 'vehicle-analysis' && tokens[i].type === 'fence' && tokens[i].info.trim().startsWith('ubi-')) {
      html += renderVehicleBlock(tokens[i].info.trim(), lang);
      continue;
    }
    const children = tokens[i + 1]?.children;
    if (tokens[i].type === 'paragraph_open' && tokens[i + 2]?.type === 'paragraph_close' &&
        children?.some(t => t.type === 'image') && children.every(t => ['image', 'softbreak'].includes(t.type))) {
      const images = children.filter(t => t.type === 'image');
      html += `<div class="research-figures${images.length > 1 ? ' paired' : ''}">${images.map(token => {
        token.attrSet('loading', 'lazy');
        token.attrSet('decoding', 'async');
        return `<figure>${md.renderer.render([token], md.options, {})}<figcaption>${escape(token.content)}</figcaption></figure>`;
      }).join('')}</div>`;
      i += 2;
    } else html += md.renderer.render([tokens[i]], md.options, {});
  }
  return html;
}
const ideaPocLabel = { ko: '아이디어 · PoC 제작', en: 'Idea & proof of concept' };
const texts = {
  ko: { work: '프로젝트', journey: '학력·경력', skills: '기술 스택', about: '소개', all: '전체', data: '데이터 & 자동화', robotics: '로봇 & 자율 시스템', selected: '프로젝트 모음', explore: '프로젝트 둘러보기', timeline: '학력과 경력', intro: '다음에 만들고 싶은 것.', back: '프로젝트 목록', detail: '자세히 보기', role: '나의 역할', period: '시기', stack: '사용 기술', concept: '개념도 · 실제 실행 화면이 아닙니다', media: '영상과 기록', resources: '관련 자료', next: '다음 프로젝트', skip: '본문으로 건너뛰기', count: '개 프로젝트', school: '학교 프로젝트', personal: '개인 프로젝트', company: '회사 프로젝트', experience: '프로젝트 경험', poc: '더미데이터 PoC', simulation: '시뮬레이션', 'in-progress': '개발 중', archive: '초기 프로젝트', toc: '이 프로젝트에서', note: '이 페이지는 현재 확인된 경험을 바탕으로 작성했습니다. 성능 수치와 상세 검증 자료는 확인 후 추가합니다.', caption: '데이터와 자율 시스템에 관한 작업 기록' },
  en: { work: 'Work', journey: 'Experience', skills: 'Skills', about: 'About', all: 'All projects', data: 'Data & automation', robotics: 'Robotics & autonomy', selected: 'Selected work', explore: 'Explore the projects', timeline: 'Education & experience.', intro: 'What I want to build next.', back: 'All projects', detail: 'Explore project', role: 'My contribution', period: 'Period', stack: 'Tools & technologies', concept: 'Concept diagram · not a recorded result', media: 'Videos & records', resources: 'Resources', next: 'Next project', skip: 'Skip to content', count: 'projects', school: 'University project', personal: 'Personal project', company: 'Company project', experience: 'Project experience', poc: 'Dummy-data PoC', simulation: 'Simulation', 'in-progress': 'In progress', archive: 'Early project', toc: 'In this project', note: 'This page describes the experience shared so far. Performance figures and detailed validation evidence will be added once verified.', caption: 'A working record of data and autonomous systems' }
};

function diagram(kind, lang) {
  const config = {
    network: { bg: '#172632', fg: '#d5e3e9', accent: '#c2f56b', code: '01 / NETWORK PROCESSING', nodes: lang === 'ko' ? ['IP 주소', 'CIDR 대역', '포함 여부 탐색'] : ['IP address', 'CIDR ranges', 'Membership lookup'], foot: 'BINARY SEARCH + NUMBA' },
    drone: { bg: '#dfe9ee', fg: '#223a49', accent: '#ec5a32', code: '02 / VISUAL PERCEPTION', nodes: lang === 'ko' ? ['YOLO + 깊이', '중심 위치 · 필터', '드론 추종'] : ['YOLO + depth', 'Center + filtering', 'Drone following'], foot: 'PERCEPTION → ESTIMATION → FOLLOWING' },
    orders: { bg: '#eae9f1', fg: '#393849', accent: '#7256c8', code: '03 / WORK IN PROGRESS', nodes: lang === 'ko' ? ['ERP 주문 정보', '최적화 모델', '제조수량 반영'] : ['ERP order data', 'Optimization', 'Production quantities'], foot: lang === 'ko' ? '점선 영역: 개발 목표' : 'DASHED STEPS: DEVELOPMENT GOALS' },
    vehicle: { bg: '#e4ebe3', fg: '#2c463c', accent: '#317453', code: '04 / VEHICLE DATA', nodes: lang === 'ko' ? ['차량 데이터', '주어진 분류 기준', 'Python 구현'] : ['Vehicle data', 'Supplied criteria', 'Python implementation'], foot: 'EXCEL → PYTHON / PANDAS' },
    foundry: { bg: '#e4e7ed', fg: '#2e3c54', accent: '#4f6ca5', code: '05 / LOCATION TRACKING', nodes: lang === 'ko' ? ['위치 정보', 'Foundry', '사용자 화면'] : ['Location data', 'Foundry', 'User interface'], foot: 'DATA → INTERFACE' },
    delta: { bg: '#ece8e0', fg: '#4b4336', accent: '#9c713e', code: '06 / ROBOTICS ARCHIVE', nodes: lang === 'ko' ? ['델타로봇', '설계', '개발'] : ['Delta robot', 'Design', 'Development'], foot: 'UNIVERSITY / YEAR 3' },
    traffic: { bg: '#e7ebee', fg: '#273e4a', accent: '#ba463a', code: '07 / TRAFFIC ROBOT CONCEPT', nodes: lang === 'ko' ? ['카메라 입력', '얼굴 검출', '결과 표시'] : ['Camera input', 'Face detection', 'Visualization'], foot: 'PYTHON / OPENCV / VISION POC' }
  }[kind];
  const { bg, fg, accent, code, nodes, foot } = config;
  // Schematic flow only: no invented measurements, results, or project screenshots.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600" role="img" aria-label="${escape(nodes.join(' → '))}">
    <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${fg}" stroke-opacity=".065"/></pattern></defs>
    <rect width="960" height="600" fill="${bg}"/><rect width="960" height="600" fill="url(#grid)"/>
    <g font-family="Arial, Apple SD Gothic Neo, sans-serif" fill="${fg}">
      <text x="48" y="62" font-size="18" letter-spacing="2">${code}</text>
      <path d="M 96 298 H 864" stroke="${fg}" stroke-width="2" opacity=".4"/>
      ${nodes.map((n, i) => `<g><rect x="${48 + i * 302}" y="216" width="260" height="164" rx="3" fill="${bg}" stroke="${i === 1 ? accent : fg}" stroke-width="${i === 1 ? 3 : 1.5}" ${kind === 'orders' && i > 0 ? 'stroke-dasharray="8 7"' : ''}/><text x="${70 + i * 302}" y="250" font-size="16" fill="${accent}">0${i + 1}</text><text x="${178 + i * 302}" y="310" text-anchor="middle" font-size="${n.length > 16 ? 21 : 25}" font-weight="500">${escape(n)}</text></g>`).join('')}
      <path d="m 317 291 8 7-8 7 m 302-14 8 7-8 7" fill="none" stroke="${fg}" stroke-width="2"/>
      <text x="48" y="543" font-size="17" letter-spacing="1.2">${escape(foot)}</text>
      <text x="912" y="543" text-anchor="end" font-size="16" opacity=".7">SCHEMATIC</text>
    </g></svg>`;
}

export async function build() {
  const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
  const allProjects = JSON.parse(await readFile(path.join(root, 'content/projects.json'), 'utf8'));
  for (const p of allProjects) {
    if (p.published !== undefined && typeof p.published !== 'boolean') throw new Error(`Invalid published flag: ${p.slug}`);
  }
  const projects = allProjects.filter(p => p.published !== false);
  const out = path.join(root, 'dist');
  const seen = new Set();
  for (const p of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || seen.has(p.slug)) throw new Error(`Invalid or duplicate slug: ${p.slug}`);
    seen.add(p.slug);
    if (!['data', 'robotics'].includes(p.category)) throw new Error(`Invalid category: ${p.slug}`);
    if (p.origin && !['school', 'personal', 'company'].includes(p.origin)) throw new Error(`Invalid origin: ${p.slug}`);
    if (!['experience', 'poc', 'idea-poc', 'simulation', 'in-progress', 'archive'].includes(p.stage)) throw new Error(`Invalid stage: ${p.slug}`);
    for (const lang of ['ko', 'en']) {
      for (const key of ['title', 'summary', 'period', 'role']) if (!p[key]?.[lang]) throw new Error(`Missing ${lang} ${key}: ${p.slug}`);
      if (p.recognition && !p.recognition[lang]) throw new Error(`Missing ${lang} recognition: ${p.slug}`);
      await access(path.join(root, `content/projects/${p.slug}.${lang}.md`));
    }
  }
  if (!isLocalMedia(site.profile.photo)) throw new Error('Profile photo must use a local media/ path');
  await access(path.join(root, 'public', site.profile.photo));
  for (const skill of site.skills.flatMap(group => group.items)) {
    if (!skill.name || !isLocalMedia(skill.icon)) throw new Error(`Invalid skill or icon: ${skill.name}`);
    await access(path.join(root, 'public', skill.icon));
  }
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'assets'), { recursive: true });
  await cp(path.join(root, 'public'), out, { recursive: true });
  await cp(path.join(root, 'src/style.css'), path.join(out, 'assets/style.css'));
  await cp(path.join(root, 'src/site.js'), path.join(out, 'assets/site.js'));

  // All generated URLs are relative, so both user sites and /repository/ Pages sites work.
  function page(lang, slug, body, title, description) {
    const t = { ...texts[lang], 'idea-poc': ideaPocLabel[lang] };
    const displayName = lang === 'en' ? (site.nameEn || site.name) : site.name;
    const home = slug ? '../../' : './';
    const base = slug ? '../../../' : '../';
    const other = lang === 'ko' ? 'en' : 'ko';
    const alternate = slug ? `../../../${other}/projects/${slug}/` : `../${other}/`;
    const socials = [[site.github, 'GitHub'], [site.linkedin, 'LinkedIn'], [site.email ? `mailto:${site.email}` : '', 'Email']].filter(([url]) => url);
    for (const [url] of socials) if (!/^(https:\/\/|mailto:)/.test(url)) throw new Error('Profile links must use HTTPS or mailto');
    return `<!doctype html><html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} — ${escape(displayName)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f4f5f6"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><link rel="alternate" hreflang="${other}" href="${alternate}"><link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/style.css"><script src="${base}assets/site.js" defer></script>${slug === 'vehicle-analysis' ? `<link rel="stylesheet" href="${base}media/vehicle/case-study.css"><script src="${base}media/vehicle/scale.js" defer></script>` : ''}</head><body>
      <a class="skip" href="#main">${t.skip}</a>
      <header class="site-header"><a class="brand" href="${home}" aria-label="${escape(displayName)} home"><span class="brand-mark" aria-hidden="true">↗</span>${escape(displayName)}<span class="brand-suffix"> / PORTFOLIO</span></a><nav aria-label="${lang === 'ko' ? '주요 메뉴' : 'Main navigation'}"><a href="${home}#work">${t.work}</a><a href="${home}#journey">${t.journey}</a><a href="${home}#skills">${t.skills}</a><a href="${home}#about">${t.about}</a></nav><div class="language" aria-label="${lang === 'ko' ? '언어' : 'Language'}">${lang === 'ko' ? '<span aria-current="true">KO</span><a href="' + alternate + '" lang="en" hreflang="en" aria-label="View this page in English">EN</a>' : '<a href="' + alternate + '" lang="ko" hreflang="ko" aria-label="이 페이지 한국어로 보기">KO</a><span aria-current="true">EN</span>'}</div></header>
      ${body}
      <footer class="site-footer"><div><a class="footer-name" href="${home}">${escape(displayName)}<span aria-hidden="true">↗</span></a><p>${t.caption}</p></div><div class="socials">${socials.map(([url, label]) => `<a href="${escape(url)}">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div><p class="footer-meta">DATA / ROBOTICS / ENGINEERING</p></footer>
    </body></html>`;
  }
  for (const lang of ['ko', 'en']) {
    const t = { ...texts[lang], 'idea-poc': ideaPocLabel[lang] };
    const dir = path.join(out, lang);
    await mkdir(dir, { recursive: true });
    for (const p of projects) {
      await writeFile(path.join(out, `assets/${p.diagram}-${lang}.svg`), diagram(p.diagram, lang));
      for (const link of p.links) if (!/^https:\/\//.test(link.url) && !isLocalMedia(link.url)) throw new Error(`Project links must use HTTPS or a local media/ path: ${p.slug}`);
      for (const item of [p.cover, p.publication?.paper, ...p.media.flatMap(m => [m.src, m.poster]), ...p.links.filter(l => isLocalMedia(l.url)).map(l => l.url)].filter(Boolean)) {
        if (!isLocalMedia(item)) throw new Error(`Use a local media/ path: ${item}`);
        await access(path.join(out, item));
      }
    }
    const cards = projects.map((p, i) => `<article class="project-card" data-category="${p.category}"><a class="card-link" href="projects/${p.slug}/"><div class="project-visual ${escape(p.diagram)}"><img src="../${p.cover || `assets/${p.diagram}-${lang}.svg`}" alt="${escape(p.cover ? (p.coverAlt?.[lang] || p.title[lang].replaceAll('\n', ' ')) : `${p.title[lang].replaceAll('\n', ' ')} — ${t.concept}`)}" width="960" height="600" ${i > 1 ? 'loading="lazy"' : 'fetchpriority="high"'}><span class="visual-label">${p.cover ? t[p.category] : (lang === 'ko' ? '구조 개념도' : 'Concept diagram')}</span><span class="card-open" aria-hidden="true">↗</span></div><div class="card-meta"><span>${String(i + 1).padStart(2, '0')} / ${t[p.category]}</span><span class="stage">${t[p.origin || p.stage]}</span></div>${recognitionBadge(p, lang)}${p.collaboration ? `<p class="collaboration-note">${escape(p.collaboration[lang])}</p>` : ''}${p.publication ? `<p class="publication-badge">${escape(p.publication.cardLabel[lang])}</p>` : ''}<h3>${lines(p.title[lang])}</h3><p class="card-summary">${escape(p.summary[lang])}</p><div class="tags">${p.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div></a></article>`).join('');
    const main = `<main id="main"><section class="hero profile-hero" aria-labelledby="profile-heading">
      <div class="eyebrow"><span class="tiny-cross" aria-hidden="true">✳</span> DATA & AUTONOMOUS SYSTEMS</div>
      <div class="profile-layout">
        <div class="profile-intro">
          <p class="profile-name">${escape(lang === 'ko' ? site.name : site.nameEn)}<span lang="${lang === 'ko' ? 'en' : 'ko'}">${escape(lang === 'ko' ? site.nameEn : site.name)}</span></p>
          <h1 id="profile-heading">${lines(site.intro[lang])}</h1>
          <p class="profile-description">${escape(site.description[lang])}</p>
          <dl class="profile-facts">${site.profile.facts.map(fact => `<div><dt>${escape(fact.label[lang])}</dt><dd><strong>${escape(fact.title[lang])}</strong><span>${escape(fact.detail[lang])}</span></dd></div>`).join('')}</dl>
          <div class="profile-actions"><a class="text-link" href="#work">${t.explore} <span aria-hidden="true">↓</span></a><div class="profile-contacts">${[[site.email ? `mailto:${site.email}` : '', 'Email'], [site.linkedin, 'LinkedIn'], [site.github, 'GitHub']].filter(([url]) => url).map(([url, label]) => `<a href="${escape(url)}">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>
        </div>
        <figure class="profile-portrait"><img src="../${escape(site.profile.photo)}" width="354" height="472" alt="${escape(site.profile.photoAlt[lang])}" fetchpriority="high"><figcaption>${escape(site.nameEn)} <span>/ PORTFOLIO</span></figcaption></figure>
      </div>
      <section id="skills" class="skills-panel" aria-labelledby="skills-heading"><h2 id="skills-heading">${t.skills}<span>TECH STACK</span></h2><div class="skill-groups">${site.skills.map(group => `<div class="skill-group"><h3>${escape(group.title[lang])}</h3><ul>${group.items.map(item => `<li><span class="skill-icon" aria-hidden="true"><img src="../${escape(item.icon)}" alt="" width="23" height="23" decoding="async"></span><span>${escape(item.name)}</span></li>`).join('')}</ul></div>`).join('')}</div></section>
    </section>
      <section id="work" class="work-section"><div class="section-title"><div><span class="eyebrow">01 / WORK</span><h2>${t.selected}</h2></div><span class="result-count" aria-live="polite" data-count data-unit="${t.count}">${projects.length} ${t.count}</span></div><div class="filters" role="group" aria-label="${lang === 'ko' ? '프로젝트 분야' : 'Project category'}">${['all','data','robotics'].map((c,i) => `<button type="button" data-filter="${c}" aria-pressed="${i === 0}">${t[c]} <span>${c === 'all' ? projects.length : projects.filter(p => p.category === c).length}</span></button>`).join('')}</div><div class="project-grid">${cards}</div></section>
      <section id="journey" class="journey-section"><div class="journey-heading"><span class="eyebrow">02 / EXPERIENCE</span><h2>${t.timeline}</h2><p>${lang === 'ko' ? '기계공학과 로봇 연구에서 출발해, 데이터와 자동화로 이어온 경험입니다.' : 'From mechanical engineering and robotics research to data and automation.'}</p></div><ol class="timeline">${site.timeline.map(entry => `<li><span class="timeline-dot" aria-hidden="true"></span><p class="timeline-period">${escape(entry.period[lang])}</p><h3>${escape(entry.title[lang])}</h3><p>${escape(entry.body[lang])}</p>${entry.positions?.length ? `<dl class="timeline-positions">${entry.positions.map(position => `<div><dt>${escape(position.period[lang])}</dt><dd><strong>${escape(position.title[lang])}</strong><span>${escape(position.body[lang])}</span></dd></div>`).join('')}</dl>` : ''}</li>`).join('')}</ol></section>
      <section id="about" class="about-section"><div><span class="eyebrow">03 / ABOUT</span><h2>${t.intro}</h2></div><div><p>${escape(site.about[lang])}</p><div class="interest-tags"><span>End-to-end data applications</span><span>Robotics & autonomous systems</span></div></div></section></main>`;

    await writeFile(path.join(dir, 'index.html'), page(lang, '', main, lang === 'ko' ? '데이터 & 자율 시스템 포트폴리오' : 'Data & autonomous systems portfolio', site.description[lang]));
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const headings = [];
      const tokens = md.parse(await readFile(path.join(root, `content/projects/${p.slug}.${lang}.md`), 'utf8'), {});
      for (let j = 0; j < tokens.length; j++) if (tokens[j].type === 'heading_open' && tokens[j].tag === 'h2') {
        const id = `section-${headings.length + 1}`;
        tokens[j].attrSet('id', id);
        headings.push({ id, title: tokens[j+1].content });
      }
      const article = renderArticle(tokens, lang, p.slug);
      const next = projects[(i+1) % projects.length];
      const media = p.media.length ? `<section id="project-media" class="media-gallery"><h2>${escape(p.mediaTitle?.[lang] || t.media)}</h2>${p.media.map(m => `<figure>${m.type === 'video' ? `<video controls playsinline preload="none"${m.poster ? ` poster="../../../${escape(m.poster)}"` : ''} src="../../../${escape(m.src)}" aria-label="${escape(m.alt[lang])}"><a href="../../../${escape(m.src)}">${escape(m.alt[lang])}</a></video>` : `<img src="../../../${escape(m.src)}" alt="${escape(m.alt[lang])}" loading="lazy">`}<figcaption>${escape(m.alt[lang])}</figcaption>${m.type === 'video' && m.chapters?.length ? `<nav class="video-chapters" aria-label="${lang === 'ko' ? '영상 구간 바로가기' : 'Video chapters'}">${m.chapters.map(chapter => `<a href="../../../${escape(m.src)}#t=${chapter.time}" data-video-time="${chapter.time}"><span>${Math.floor(chapter.time / 60)}:${String(chapter.time % 60).padStart(2, '0')}</span>${escape(chapter.label[lang])}</a>`).join('')}</nav>` : ''}</figure>`).join('')}</section>` : '';
      const resources = p.links.length ? `<section id="project-resources" class="resources"><h2>${t.resources}</h2>${p.links.map(link => `<a href="${escape(resourceHref(link.url))}">${escape(link.label[lang])} ↗</a>`).join('')}</section>` : '';
      const highlights = p.highlights?.length ? `<dl class="research-highlights">${p.highlights.map(item => `<div><dt>${escape(item.label[lang])}</dt><dd>${escape(lang === 'en' ? (item.valueEn || item.value) : item.value)}</dd></div>`).join('')}</dl>` : '';
      const disclosure = p.disclosure ? `<aside class="project-disclosure" aria-label="${escape(p.disclosure.title[lang])}"><strong>${escape(p.disclosure.title[lang])}</strong><p>${escape(p.disclosure.body[lang])}</p></aside>` : '';
      const publication = p.publication ? `<aside class="publication" aria-label="${lang === 'ko' ? '학술대회 논문 게재' : 'Conference publication'}"><div class="publication-author"><span>${lang === 'ko' ? '학술대회 논문' : 'CONFERENCE PAPER'}</span><strong>${escape(p.publication.authorRole[lang])}</strong><span>${escape(p.publication.author[lang])}</span></div><div class="publication-record"><h2>${escape(p.publication.venue[lang])}</h2><p class="publication-citation">${escape(p.publication.citation)}</p><p>${escape(p.publication.session[lang])} <code>${escape(p.publication.sessionId)}</code></p><a href="${escape(resourceHref(p.publication.paper))}">${lang === 'ko' ? '제1저자 논문 원문 보기' : 'Read the first-author paper'} <span aria-hidden="true">↗</span></a></div></aside>` : '';
      const actions = p.showHeaderActions !== false && (p.media.length || p.links.length) ? `<div class="detail-actions">${p.media.length ? `<a href="#project-media">${escape(p.mediaLabel?.[lang] || (lang === 'ko' ? '실험 영상 보기' : 'Watch the simulation'))} <span aria-hidden="true">↓</span></a>` : ''}${p.links.length ? `<a href="#project-resources">${escape(p.resourcesLabel?.[lang] || (lang === 'ko' ? '논문·발표자료' : 'Paper & presentation'))} <span aria-hidden="true">↓</span></a>` : ''}</div>` : '';
      const detail = `<main id="main" class="detail-main${p.slug === 'vehicle-analysis' ? ' ubi-detail' : ''}${p.highlights?.length ? ' research-detail' : ''}"><a class="back-link" href="../../#work">← ${t.back}</a><header class="detail-header"><div class="eyebrow">${t[p.category]} / ${p.origin ? `${t[p.origin]} / ` : ''}${t[p.stage]}</div>${p.collaboration ? `<p class="collaboration-note">${escape(p.collaboration[lang])}</p>` : ''}${recognitionBadge(p, lang)}<h1>${lines(p.title[lang])}</h1><p class="detail-summary">${escape(p.summary[lang])}</p>${publication}${disclosure}${actions}<dl class="project-facts"><div><dt>${t.role}</dt><dd>${escape(p.role[lang])}</dd></div><div><dt>${t.period}</dt><dd>${escape(p.period[lang])}</dd></div><div><dt>${t.stack}</dt><dd>${p.tags.map(escape).join(' · ')}</dd></div></dl></header><figure class="detail-cover"><img src="../../../${p.cover || `assets/${p.diagram}-${lang}.svg`}" alt="${escape(p.coverAlt?.[lang] || p.title[lang].replaceAll('\n',' '))}" width="960" height="600">${p.cover ? (p.coverCaption?.[lang] ? `<figcaption>${escape(p.coverCaption[lang])}</figcaption>` : '') : `<figcaption>${t.concept}</figcaption>`}</figure>${highlights}${p.highlights?.length ? `<div class="research-demo">${media}</div>` : ''}<div class="article-layout"><aside class="article-nav"><p>${t.toc}</p><nav aria-label="${t.toc}">${headings.map(h => `<a href="#${h.id}">${escape(h.title)}</a>`).join('')}</nav></aside><div class="article-content"><article class="prose">${article}</article>${p.highlights?.length ? '' : media}${resources}<p class="evidence-note">${escape(p.evidenceNote?.[lang] || t.note)}</p></div></div><a class="next-project" href="../${next.slug}/"><span>${t.next}</span><strong>${escape(next.title[lang].replaceAll('\n',' '))}</strong><span aria-hidden="true">↗</span></a></main>`;
      const detailDir = path.join(dir, 'projects', p.slug);
      await mkdir(detailDir, { recursive: true });
      await writeFile(path.join(detailDir, 'index.html'), page(lang, p.slug, detail, p.title[lang].replaceAll('\n',' '), p.summary[lang]));
    }
  }
  await writeFile(path.join(out, 'index.html'), '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./ko/"><title>Portfolio</title></head><body><a href="./ko/">한국어 포트폴리오</a> · <a href="./en/">English portfolio</a></body></html>');
  await writeFile(path.join(out, '.nojekyll'), '');
  console.log(`Built ${projects.length} projects in Korean and English → dist/`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
