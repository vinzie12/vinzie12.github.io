(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const safeText = (v) => (typeof v === 'string' ? v.trim() : '');

  const THEME_KEY = 'vince_theme';

  const getTheme = () => {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    return htmlTheme === 'light' ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');

    const metaTheme = qs('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#0b1220');
  };

  const renderThemeToggleUI = () => {
    const btn = qs('#themeToggle');
    const iconHost = qs('#themeIcon');
    const theme = getTheme();
    if (btn) btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');

    if (iconHost) {
      const iconName = theme === 'light' ? 'moon' : 'sun';
      if (window.lucide?.icons?.[iconName]?.toSvg) {
        iconHost.innerHTML = window.lucide.icons[iconName].toSvg({ width: 18, height: 18 });
      } else {
        iconHost.textContent = theme === 'light' ? '☾' : '☀';
      }
    }
  };

  const initThemeToggle = () => {
    const btn = qs('#themeToggle');
    if (!btn) return;

    applyTheme(getTheme());
    renderThemeToggleUI();

    btn.addEventListener('click', () => {
      const current = getTheme();
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_) {
      }
      renderThemeToggleUI();
    });
  };

  const initAOS = () => {
    if (!window.AOS) return;
    window.AOS.init({
      once: true,
      offset: 80,
      duration: 650,
      easing: 'ease-out-cubic'
    });
  };

  const initHeroCanvas = () => {
    const canvas = qs('#heroCanvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const hero = canvas.closest('.hero');
    if (!(hero instanceof HTMLElement)) return;

    const prefersReducedMotion =
      window.matchMedia &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const rand = (a, b) => a + Math.random() * (b - a);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastT = 0;

    const mouse = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      active: false
    };

    const nodes = [];
    const edges = [];
    const pulses = [];

    const parseRgb = (v) => {
      const s = String(v || '').trim();
      if (!s) return null;
      if (s[0] === '#') {
        const hex = s.slice(1);
        const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
        if (full.length !== 6) return null;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;
        return { r, g, b };
      }
      const m = s.match(/rgba?\(([^)]+)\)/i);
      if (!m) return null;
      const parts = m[1]
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const r = Number(parts[0]);
      const g = Number(parts[1]);
      const b = Number(parts[2]);
      if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;
      return { r, g, b };
    };

    const rgba = (rgb, a) => {
      if (!rgb) return `rgba(255,255,255,${a})`;
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
    };

    let cachedTheme = '';
    let cachedColors = null;
    const themeColors = () => {
      const theme = getTheme();
      if (cachedColors && cachedTheme === theme) return cachedColors;

      const cs = getComputedStyle(document.documentElement);
      const brand = parseRgb(cs.getPropertyValue('--brand'));
      const brand2 = parseRgb(cs.getPropertyValue('--brand2'));
      const text = parseRgb(cs.getPropertyValue('--text'));

      const traceA = theme === 'light' ? 0.12 : 0.10;
      const nodeA = theme === 'light' ? 0.24 : 0.22;
      const hotA = theme === 'light' ? 0.24 : 0.22;

      cachedTheme = theme;
      cachedColors = {
        trace: rgba(text, traceA),
        traceHot: rgba(brand2, hotA),
        node: rgba(text, nodeA),
        nodeHot: rgba(brand2, theme === 'light' ? 0.74 : 0.82),
        glow: rgba(brand, theme === 'light' ? 0.12 : 0.10),
        glow2: rgba(brand2, theme === 'light' ? 0.10 : 0.08),
        pulse: rgba(brand, theme === 'light' ? 0.88 : 0.92)
      };
      return cachedColors;
    };

    const buildCircuit = () => {
      nodes.length = 0;
      edges.length = 0;
      pulses.length = 0;

      const step = clamp(Math.round(w / 10), 82, 132);
      const ox = step * 0.55;
      const oy = step * 0.55;
      const jitter = step * 0.16;

      const cols = Math.max(2, Math.floor((w - ox * 2) / step) + 1);
      const rows = Math.max(2, Math.floor((h - oy * 2) / step) + 1);

      const idx = (cx, cy) => cy * cols + cx;

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const x = clamp(ox + cx * step + rand(-jitter, jitter), 14, w - 14);
          const y = clamp(oy + cy * step + rand(-jitter, jitter), 14, h - 14);
          nodes.push({ cx, cy, x, y });
        }
      }

      const edgeKey = new Set();
      const addEdge = (a, b) => {
        const ia = idx(a.cx, a.cy);
        const ib = idx(b.cx, b.cy);
        const k = ia < ib ? `${ia}:${ib}` : `${ib}:${ia}`;
        if (edgeKey.has(k)) return;
        edgeKey.add(k);

        const turnXFirst = Math.random() < 0.55;
        const mid1 = turnXFirst ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
        const points = [{ x: a.x, y: a.y }, mid1, { x: b.x, y: b.y }];

        const segs = [];
        let total = 0;
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
          if (len < 6) continue;
          segs.push({ x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y, len });
          total += len;
        }
        if (!segs.length || total < 14) return;
        edges.push({ a, b, segs, total });
      };

      const nodeAt = (cx, cy) => {
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return null;
        return nodes[idx(cx, cy)] || null;
      };

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const a = nodeAt(cx, cy);
          if (!a) continue;

          const right = nodeAt(cx + 1, cy);
          const down = nodeAt(cx, cy + 1);
          if (right && Math.random() < 0.55) addEdge(a, right);
          if (down && Math.random() < 0.55) addEdge(a, down);

          if (Math.random() < 0.18) {
            const jumpR = nodeAt(cx + 2, cy);
            if (jumpR) addEdge(a, jumpR);
          }
          if (Math.random() < 0.18) {
            const jumpD = nodeAt(cx, cy + 2);
            if (jumpD) addEdge(a, jumpD);
          }
        }
      }

      const seedPulses = Math.min(10, Math.max(4, Math.round(edges.length / 10)));
      for (let i = 0; i < seedPulses; i++) {
        spawnPulse(true);
      }
    };

    const spawnPulse = (randomStart) => {
      if (!edges.length) return;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const speed = rand(130, 210);
      pulses.push({
        edge,
        t: randomStart ? rand(0, edge.total) : 0,
        speed,
        life: rand(1.6, 3.4)
      });
    };

    const getPulsePoint = (edge, dist) => {
      let d = dist;
      for (let i = 0; i < edge.segs.length; i++) {
        const s = edge.segs[i];
        if (d <= s.len) {
          const t = s.len ? d / s.len : 0;
          return {
            x: s.x0 + (s.x1 - s.x0) * t,
            y: s.y0 + (s.y1 - s.y0) * t
          };
        }
        d -= s.len;
      }
      const last = edge.segs[edge.segs.length - 1];
      return { x: last.x1, y: last.y1 };
    };

    const distToSegment = (px, py, x0, y0, x1, y1) => {
      const vx = x1 - x0;
      const vy = y1 - y0;
      const wx = px - x0;
      const wy = py - y0;
      const c1 = vx * wx + vy * wy;
      if (c1 <= 0) return Math.hypot(px - x0, py - y0);
      const c2 = vx * vx + vy * vy;
      if (c2 <= c1) return Math.hypot(px - x1, py - y1);
      const t = c2 ? c1 / c2 : 0;
      const bx = x0 + vx * t;
      const by = y0 + vy * t;
      return Math.hypot(px - bx, py - by);
    };

    const draw = () => {
      const c = themeColors();
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.active ? mouse.x : w * 0.45;
      const my = mouse.active ? mouse.y : h * 0.32;
      const glowR = Math.max(w, h) * 0.55;
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
      g.addColorStop(0, c.glow);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.82, h * 0.18, 0, w * 0.82, h * 0.18, glowR);
      g2.addColorStop(0, c.glow2);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const hotRadius = clamp(Math.min(w, h) * 0.22, 140, 240);

      ctx.lineWidth = 1;
      ctx.strokeStyle = c.trace;
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];

        let hot = 0;
        if (mouse.active) {
          let best = Number.POSITIVE_INFINITY;
          for (let j = 0; j < e.segs.length; j++) {
            const s = e.segs[j];
            const d = distToSegment(mouse.x, mouse.y, s.x0, s.y0, s.x1, s.y1);
            if (d < best) best = d;
          }
          hot = clamp(1 - best / hotRadius, 0, 1);
        }

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        for (let j = 0; j < e.segs.length; j++) {
          const s = e.segs[j];
          ctx.moveTo(s.x0, s.y0);
          ctx.lineTo(s.x1, s.y1);
        }
        ctx.stroke();

        if (hot > 0.02) {
          ctx.globalAlpha = 0.45 * hot;
          ctx.strokeStyle = c.traceHot;
          ctx.beginPath();
          for (let j = 0; j < e.segs.length; j++) {
            const s = e.segs[j];
            ctx.moveTo(s.x0, s.y0);
            ctx.lineTo(s.x1, s.y1);
          }
          ctx.stroke();
          ctx.strokeStyle = c.trace;
        }
      }

      ctx.globalAlpha = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const d = mouse.active ? Math.hypot(n.x - mouse.x, n.y - mouse.y) : Number.POSITIVE_INFINITY;
        const hot = mouse.active ? clamp(1 - d / hotRadius, 0, 1) : 0;
        const r = 1.35 + hot * 0.55;

        ctx.beginPath();
        ctx.fillStyle = hot > 0.02 ? c.nodeHot : c.node;
        ctx.globalAlpha = hot > 0.02 ? 0.92 : 0.75;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (prefersReducedMotion) return;

      ctx.strokeStyle = c.pulse;
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const edge = p.edge;
        const pt = getPulsePoint(edge, p.t);
        const tail = clamp(18 + (p.speed - 130) * 0.06, 18, 26);
        const back = getPulsePoint(edge, Math.max(0, p.t - tail));

        ctx.globalAlpha = clamp(p.life / 0.6, 0, 1);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(back.x, back.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = c.pulse;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
    };

    const update = (dt) => {
      if (!pulses.length) {
        spawnPulse(false);
        return;
      }

      const mv = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const cursorBoost = clamp(1 + mv * 0.0022, 1, 1.55);

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += (p.speed * cursorBoost * dt) / 1000;
        p.life -= dt / 1000;
        if (p.t >= p.edge.total || p.life <= 0) pulses.splice(i, 1);
      }

      const target = clamp(Math.round(edges.length / 10), 6, 18);
      if (pulses.length < target && Math.random() < 0.26) spawnPulse(false);

      mouse.vx *= 0.9;
      mouse.vy *= 0.9;
    };

    const frame = (t) => {
      if (!running) return;
      const now = typeof t === 'number' ? t : performance.now();
      const dt = lastT ? clamp(now - lastT, 0, 38) : 16;
      lastT = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastT = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (clientX, clientY) => {
      const r = hero.getBoundingClientRect();
      const nx = clamp(clientX - r.left, 0, r.width);
      const ny = clamp(clientY - r.top, 0, r.height);
      mouse.vx += (nx - mouse.x) * 0.16;
      mouse.vy += (ny - mouse.y) * 0.16;
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;
      if (prefersReducedMotion) draw();
    };

    hero.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
    hero.addEventListener('mouseleave', () => {
      mouse.active = false;
      if (prefersReducedMotion) draw();
    });
    hero.addEventListener(
      'touchmove',
      (e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        onMove(t.clientX, t.clientY);
      },
      { passive: true }
    );
    hero.addEventListener('touchend', () => {
      mouse.active = false;
      if (prefersReducedMotion) draw();
    });

    const resize = () => {
      const r = hero.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCircuit();
    };

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);

    if ('MutationObserver' in window) {
      const mo = new MutationObserver(() => {
        draw();
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    resize();
    mouse.x = w * 0.48;
    mouse.y = h * 0.34;
    draw();

    if (prefersReducedMotion) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const v = entries.some((en) => en.isIntersecting);
          if (v) start();
          else stop();
        },
        { threshold: 0.08 }
      );
      io.observe(hero);
    } else {
      start();
    }
  };

  const initLucide = () => {
    if (!window.lucide || typeof window.lucide.createIcons !== 'function') return;
    window.lucide.createIcons();
  };

  const initYear = () => {
    const year = qs('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  };

  const initMobileNav = () => {
    const navToggle = qs('.nav-toggle');
    const navMenu = qs('#navMenu');
    if (!navToggle || !navMenu) return;

    const setMenuOpen = (open) => {
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navMenu.classList.toggle('is-open', open);
    };

    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      setMenuOpen(open);
    });

    qsa('a', navMenu).forEach((a) => {
      a.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('is-open')) return;
      const t = e.target;
      if (t instanceof Node && !navMenu.contains(t) && !navToggle.contains(t)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });
  };

  const initAccordion = () => {
    const items = qsa('[data-accordion]');
    if (!items.length) return;

    items.forEach((btn) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      btn.addEventListener('click', () => {
        const scope = btn.closest('[data-roadmap-track]') || btn.closest('.timeline') || document;
        const siblings = qsa('[data-accordion]', scope);
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        siblings.forEach((b) => b.setAttribute('aria-expanded', 'false'));
        btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      });
    });
  };

  const initRoadmap = () => {
    const roadmap = qs('[data-roadmap]');
    if (!roadmap) return;

    const track = qs('[data-roadmap-track]', roadmap);
    const line = qs('[data-roadmap-line]', roadmap);
    const progressFill = qs('[data-roadmap-progress-fill]', roadmap);
    const progressText = qs('[data-roadmap-progress-text]', roadmap);
    const progressBar = qs('.roadmap-progress-bar', roadmap);
    const nextEl = qs('[data-roadmap-next]', roadmap);
    const navBtns = qsa('[data-roadmap-jump]', roadmap);

    const milestones = qsa('[data-milestone]', roadmap);
    if (!milestones.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp01 = (n) => Math.min(1, Math.max(0, n));

    const animateCount = (el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.dataset.counted === 'true') return;

      const target = Number(el.getAttribute('data-target') || 0);
      if (!Number.isFinite(target)) return;
      el.dataset.counted = 'true';

      if (prefersReducedMotion) {
        el.textContent = String(Math.round(target));
        return;
      }

      const start = 0;
      const duration = 900;
      const t0 = performance.now();
      const tick = (now) => {
        const p = clamp01((now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = start + (target - start) * eased;
        el.textContent = String(Math.round(value));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const animateSkillBars = (root) => {
      qsa('[data-skill-bar]', root).forEach((wrap) => {
        const level = Number(wrap.getAttribute('data-level') || 0);
        const span = qs('.m-bar span', wrap);
        if (!span) return;
        span.style.width = `${Math.max(0, Math.min(100, level))}%`;
      });
    };

    const animateMilestone = (milestone) => {
      if (!(milestone instanceof HTMLElement)) return;
      if (milestone.dataset.animated === 'true') return;
      milestone.dataset.animated = 'true';

      qsa('[data-countup]', milestone).forEach((el) => animateCount(el));
      animateSkillBars(milestone);
    };

    const getTrigger = (milestone) => qs('[data-milestone-trigger]', milestone);

    const isTriggerOpen = (milestone) => {
      const trigger = getTrigger(milestone);
      return trigger?.getAttribute('aria-expanded') === 'true';
    };

    const closeMilestone = (milestone) => {
      if (!(milestone instanceof HTMLElement)) return;
      const trigger = getTrigger(milestone);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      syncModalState();
      setNextMilestone();
      setActiveNav();
    };

    const ensureModalStructure = (milestone) => {
      if (!(milestone instanceof HTMLElement)) return;
      const panel = qs('.milestone-panel', milestone);
      if (!panel) return;

      const ensureDialogHeader = (dialog) => {
        if (!(dialog instanceof HTMLElement)) return;
        if (qs('.milestone-dialog-head', dialog)) return;

        const range = safeText(qs('.milestone-range', milestone)?.textContent);
        const role = safeText(qs('.milestone-role', milestone)?.textContent);
        const org = safeText(qs('.milestone-org', milestone)?.textContent);

        const head = document.createElement('div');
        head.className = 'milestone-dialog-head';

        const kicker = document.createElement('p');
        kicker.className = 'milestone-dialog-kicker';
        kicker.textContent = range || 'Milestone';

        const title = document.createElement('p');
        title.className = 'milestone-dialog-title';
        title.textContent = role || 'Details';

        const sub = document.createElement('p');
        sub.className = 'milestone-dialog-sub muted';
        sub.textContent = org;

        head.appendChild(kicker);
        head.appendChild(title);
        if (org) head.appendChild(sub);

        const closeBtn = qs('.milestone-close', dialog);
        if (closeBtn) closeBtn.insertAdjacentElement('afterend', head);
        else dialog.prepend(head);
      };

      if (panel.dataset.modalBound !== 'true') {
        panel.dataset.modalBound = 'true';
        panel.addEventListener(
          'click',
          (e) => {
            e.stopPropagation();
            if (e.target === panel) closeMilestone(milestone);
          },
          false
        );
      }

      const existingDialog = qs('.milestone-dialog', panel);
      if (existingDialog) {
        if (existingDialog.dataset.bound !== 'true') {
          existingDialog.dataset.bound = 'true';
          existingDialog.addEventListener(
            'click',
            (e) => {
              e.stopPropagation();
            },
            false
          );
        }

        const closeBtnExisting = qs('.milestone-close', existingDialog);
        if (!closeBtnExisting) {
          const closeBtn = document.createElement('button');
          closeBtn.className = 'milestone-close';
          closeBtn.type = 'button';
          closeBtn.setAttribute('aria-label', 'Close details');
          closeBtn.textContent = '×';
          closeBtn.addEventListener(
            'click',
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              closeMilestone(milestone);
            },
            false
          );
          existingDialog.prepend(closeBtn);
        }

        ensureDialogHeader(existingDialog);
        return;
      }

      const dialog = document.createElement('div');
      dialog.className = 'milestone-dialog';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('tabindex', '-1');

      const closeBtn = document.createElement('button');
      closeBtn.className = 'milestone-close';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close details');
      closeBtn.textContent = '×';
      closeBtn.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeMilestone(milestone);
        },
        false
      );
      dialog.appendChild(closeBtn);

      ensureDialogHeader(dialog);

      while (panel.firstChild) dialog.appendChild(panel.firstChild);
      panel.appendChild(dialog);

      dialog.dataset.bound = 'true';
      dialog.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
        false
      );
    };

    const getOpenMilestone = () =>
      milestones.find((m) => !m.hidden && isTriggerOpen(m)) || null;

    const syncModalState = () => {
      const open = getOpenMilestone();
      if (open) {
        document.body.classList.add('rm-modal-open');
        ensureModalStructure(open);

        const panel = qs('.milestone-panel', open);
        const dialog = panel ? qs('.milestone-dialog', panel) : null;
        if (dialog instanceof HTMLElement) {
          requestAnimationFrame(() => {
            try {
              dialog.focus();
            } catch (_) {
            }
          });
        }
      } else {
        document.body.classList.remove('rm-modal-open');
      }
    };

    const openMilestone = (milestone) => {
      if (!(milestone instanceof HTMLElement)) return;
      if (roadmap.getAttribute('data-view') === 'simplified') return;

      const scope = milestone.closest('[data-roadmap-track]') || document;
      qsa('[data-milestone-trigger]', scope).forEach((t) => t.setAttribute('aria-expanded', 'false'));
      const trigger = getTrigger(milestone);
      if (!trigger) return;
      trigger.setAttribute('aria-expanded', 'true');
      animateMilestone(milestone);
      syncModalState();
    };

    const getMilestoneLabel = (milestone) => {
      const range = safeText(qs('.milestone-range', milestone)?.textContent);
      const role = safeText(qs('.milestone-role', milestone)?.textContent);
      if (range && role) return `${range} — ${role}`;
      return range || role || 'Milestone';
    };

    const setNextMilestone = () => {
      milestones.forEach((m) => m.classList.remove('is-next'));
      const next = milestones.find((m) => !m.classList.contains('is-visible') && !m.hidden);
      if (next) next.classList.add('is-next');

      if (nextEl) {
        if (next) nextEl.textContent = `Next milestone: ${getMilestoneLabel(next)}`;
        else nextEl.textContent = 'Next milestone: You’re at the latest milestone.';
      }
    };

    const setActiveNav = () => {
      if (!navBtns.length) return;
      const visible = milestones.filter((m) => !m.hidden);
      if (!visible.length) return;

      const vh = window.innerHeight || 1;
      const anchorY = vh * 0.32;
      let best = visible[0];
      let bestDist = Number.POSITIVE_INFINITY;
      visible.forEach((m) => {
        const r = m.getBoundingClientRect();
        const dist = Math.abs(r.top - anchorY);
        if (dist < bestDist) {
          bestDist = dist;
          best = m;
        }
      });

      const id = best.id ? `#${best.id}` : '';
      navBtns.forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-roadmap-jump') === id);
      });
    };

    const updateProgress = () => {
      const rect = roadmap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = Math.max(1, rect.height - vh * 0.3);
      const progressed = clamp01((-rect.top + vh * 0.25) / total);

      if (track) track.style.setProperty('--roadmap-progress', String(progressed));
      if (line) line.style.transform = `scaleY(${progressed})`;

      const pct = Math.round(progressed * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `${pct}%`;
      if (progressBar) progressBar.setAttribute('aria-valuenow', String(pct));
    };

    const rafScroll = (() => {
      let ticking = false;
      return () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateProgress();
          setNextMilestone();
          setActiveNav();
          ticking = false;
        });
      };
    })();

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (!(el instanceof HTMLElement)) return;
            if (entry.isIntersecting) {
              el.classList.add('is-visible');
              animateMilestone(el);
            }
          });
          setNextMilestone();
        },
        { threshold: 0.25 }
      );
      milestones.forEach((m) => io.observe(m));
    } else {
      milestones.forEach((m) => {
        m.classList.add('is-visible');
        animateMilestone(m);
      });
    }

    milestones.forEach((m) => {
      const trigger = getTrigger(m);
      if (!trigger) return;

      trigger.addEventListener(
        'click',
        (e) => {
          if (roadmap.getAttribute('data-view') === 'simplified') {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        },
        true
      );

      trigger.addEventListener('click', () => {
        queueMicrotask(() => {
          const open = trigger.getAttribute('aria-expanded') === 'true';
          syncModalState();
          if (open) {
            requestAnimationFrame(() => {
              animateMilestone(m);
            });
          }
        });
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const open = getOpenMilestone();
      if (!open) return;
      closeMilestone(open);
    });

    navBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sel = btn.getAttribute('data-roadmap-jump') || '';
        const target = sel ? qs(sel) : null;
        if (!target || !(target instanceof HTMLElement) || target.hidden) return;
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior, block: 'start' });
        openMilestone(target);
        requestAnimationFrame(() => {
          setActiveNav();
          setNextMilestone();
        });
      });
    });

    let activeSkill = 'all';
    let activeType = 'all';

    const setActiveChip = (selector, value, attr) => {
      qsa(selector, roadmap).forEach((btn) => {
        const v = btn.getAttribute(attr);
        btn.classList.toggle('is-active', v === value);
      });
    };

    const revealVisibleInViewport = () => {
      const vh = window.innerHeight || 1;
      milestones.forEach((m) => {
        if (m.hidden) return;
        const r = m.getBoundingClientRect();
        const inView = r.top < vh * 0.85 && r.bottom > vh * 0.15;
        if (inView) {
          m.classList.add('is-visible');
          animateMilestone(m);
        }
      });
    };

    const applyFilters = () => {
      milestones.forEach((m) => {
        const skillStr = (m.getAttribute('data-skills') || '').trim();
        const skills = skillStr ? skillStr.split(/\s+/) : [];
        const type = m.getAttribute('data-type') || '';

        const skillMatch = activeSkill === 'all' || skills.includes(activeSkill);
        const typeMatch = activeType === 'all' || type === activeType;

        m.hidden = !(skillMatch && typeMatch);
      });

      const open = getOpenMilestone();
      if (open && open.hidden) {
        const trigger = getTrigger(open);
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }

      updateProgress();
      revealVisibleInViewport();
      setNextMilestone();
      setActiveNav();
      syncModalState();
    };

    qsa('[data-roadmap-filter-skill]', roadmap).forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSkill = btn.getAttribute('data-roadmap-filter-skill') || 'all';
        setActiveChip('[data-roadmap-filter-skill]', activeSkill, 'data-roadmap-filter-skill');
        applyFilters();
      });
    });

    qsa('[data-roadmap-filter-type]', roadmap).forEach((btn) => {
      btn.addEventListener('click', () => {
        activeType = btn.getAttribute('data-roadmap-filter-type') || 'all';
        setActiveChip('[data-roadmap-filter-type]', activeType, 'data-roadmap-filter-type');
        applyFilters();
      });
    });

    qsa('[data-roadmap-view]', roadmap).forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-roadmap-view') || 'detailed';
        roadmap.setAttribute('data-view', view);
        setActiveChip('[data-roadmap-view]', view, 'data-roadmap-view');

        if (view === 'simplified') {
          qsa('[data-milestone-trigger]', roadmap).forEach((t) => t.setAttribute('aria-expanded', 'false'));
          syncModalState();
        }
      });
    });

    updateProgress();
    setNextMilestone();
    setActiveNav();
    applyFilters();
    syncModalState();

    window.addEventListener('scroll', rafScroll, { passive: true });
    window.addEventListener('resize', rafScroll);
  };

  const initSkillBars = () => {
    const animate = () => {
      qsa('.bar span').forEach((span) => {
        const styleAttr = span.getAttribute('style') || '';
        const match = styleAttr.match(/--w\s*:\s*([^;]+)\s*;?/);
        if (match && match[1]) span.style.width = match[1].trim();
      });
    };

    const skills = qs('#skills');
    if (!skills) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              io.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(skills);
    } else {
      animate();
    }
  };

  const initContactForm = () => {
    const form = qs('#contactForm');
    const status = qs('#formStatus');
    if (!form || !status) return;

    const setStatus = (msg) => {
      status.textContent = msg;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = safeText(qs('#name')?.value);
      const email = safeText(qs('#email')?.value);
      const subject = safeText(qs('#subject')?.value);
      const message = safeText(qs('#message')?.value);

      if (!name || !email || !subject || !message) {
        setStatus('Please complete all fields before sending.');
        return;
      }

      const to = 'vinceyancy.cadutdut@gmail.com';
      const mailSubject = encodeURIComponent(`${subject} — ${name}`);
      const body = encodeURIComponent(
        `Hi Vince,\n\n${message}\n\n— ${name}\n${email}`
      );

      const href = `mailto:${to}?subject=${mailSubject}&body=${body}`;
      window.location.href = href;
      setStatus('Opening your email app…');
    });
  };

  const initSkillQuiz = () => {
    const form = qs('#skillQuiz');
    const result = qs('#quizResult');
    const emailLink = qs('#quizEmailLink');
    if (!form || !result || !emailLink) return;

    const goalText = {
      web: 'Web Application Development',
      automation: 'AI Integration & Automation',
      support: 'IT Support & Troubleshooting'
    };

    const timelineText = {
      urgent: 'Urgent (ASAP)',
      soon: 'Soon (1–4 weeks)',
      flexible: 'Flexible / planning stage'
    };

    const modeText = {
      solo: 'End-to-end delivery',
      team: 'Team support / collaboration',
      consult: 'Consultation + plan first'
    };

    const buildRecommendation = (goal, timeline, mode) => {
      const service = goalText[goal] || 'Consultation';
      const timelineLabel = timelineText[timeline] || 'Not specified';
      const modeLabel = modeText[mode] || 'Not specified';

      const recParts = [
        `Recommendation: ${service}.`,
        `Timeline: ${timelineLabel}.`,
        `Collaboration: ${modeLabel}.`,
        'Next step: Share 1–2 details about your current setup and your desired outcome.'
      ];

      return recParts.join(' ');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const goal = String(data.get('goal') || '');
      const timeline = String(data.get('timeline') || '');
      const mode = String(data.get('mode') || '');

      if (!goal || !timeline || !mode) {
        result.textContent = 'Please answer all questions to get a recommendation.';
        emailLink.hidden = true;
        return;
      }

      const rec = buildRecommendation(goal, timeline, mode);
      result.textContent = rec;

      const to = 'vinceyancy.cadutdut@gmail.com';
      const subject = encodeURIComponent(`Need Assessment — ${goalText[goal] || 'Inquiry'}`);
      const body = encodeURIComponent(
        `Hi Vince,\n\nHere are my answers to the Quick Need Assessment:\n\n` +
          `Goal: ${goalText[goal] || goal}\n` +
          `Timeline: ${timelineText[timeline] || timeline}\n` +
          `Collaboration: ${modeText[mode] || mode}\n\n` +
          `Your recommendation:\n${rec}\n\n` +
          `Additional details:\n(please add a short description of your project / problem here)\n`
      );

      emailLink.href = `mailto:${to}?subject=${subject}&body=${body}`;
      emailLink.hidden = false;
    });
  };

  const initChatWidget = () => {
    const toggle = qs('#chatToggle');
    const panel = qs('#chatPanel');
    if (!toggle || !panel) return;

    const setOpen = (open) => {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    document.addEventListener('click', (e) => {
      if (panel.hidden) return;
      const t = e.target;
      if (t instanceof Node && !panel.contains(t) && !toggle.contains(t)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    qsa('a', panel).forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
  };

  const initResumeDownload = () => {
    const btns = qsa('#resumeBtn, #resumeBtn2');
    if (!btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const jsPDF = window.jspdf?.jsPDF;
        if (!jsPDF) {
          alert('Resume generator not available (jsPDF failed to load).');
          return;
        }

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 48;
        let y = margin;

        const title = 'Vince Yancy Cadutdut';
        const subtitle = 'Web Developer & IT Support Specialist';
        const contact = 'Aurora, Zamboanga Del Sur, Philippines | vinceyancy.cadutdut@gmail.com | +63 976 048 7232';

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text(title, margin, y);
        y += 22;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(subtitle, margin, y);
        y += 18;

        doc.setTextColor(100);
        doc.setFontSize(10);
        doc.text(contact, margin, y);
        doc.setTextColor(0);
        y += 22;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Profile', margin, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        const profile =
          'Web developer with hands-on experience building and maintaining web-based applications, including AI agents and automation. Strong troubleshooting skills for computer systems, networks, and peripherals. ESL teaching background supports clear, effective communication.';
        const profileLines = doc.splitTextToSize(profile, 595 - margin * 2);
        doc.text(profileLines, margin, y);
        y += profileLines.length * 12 + 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Experience', margin, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        const expLines = [
          'Citistar Trade Development Corporation — Web Developer & IT Support (2024–2026)',
          '• Developed and maintained web-based applications for business operations.',
          '• Leveraged AI agents and automation tools; integrated AI-powered task automation.',
          '• Provided IT support (systems, printers, and network connectivity).',
          '',
          'Various Platforms — Online ESL Teacher (2019–2024)',
          '• Improved communication and adaptability across digital platforms.',
          '',
          'Analog Devices Inc., Philippines — Test Engineering Intern (2016)',
          '• Assisted database management and test troubleshooting using Python.'
        ];
        expLines.forEach((line) => {
          const lines = doc.splitTextToSize(line, 595 - margin * 2);
          doc.text(lines, margin, y);
          y += lines.length * 12;
          if (y > 770) {
            doc.addPage();
            y = margin;
          }
        });

        if (y < 740) y += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Skills', margin, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        const skills =
          'HTML, CSS, JavaScript, Responsive Web Design, Web Application Development, Cross-browser Compatibility, Hardware Troubleshooting, Printer Configuration & Repair, Network Diagnostics, System Maintenance, Communication, Problem Solving, Team Collaboration, Time Management';
        const skillLines = doc.splitTextToSize(skills, 595 - margin * 2);
        doc.text(skillLines, margin, y);

        doc.save('Vince-Yancy-Cadutdut-Resume.pdf');
      });
    });
  };

  const initProjectGallery = () => {
    qsa('.bento-gallery').forEach(gallery => {
      const card = gallery.closest('.bento-card');
      if (!card) return;
      const mainBg = qs('.bento-bg', card);
      if (!mainBg) return;

      qsa('.bento-thumb', gallery).forEach(btn => {
        btn.addEventListener('click', () => {
          const img = qs('img', btn);
          if (!img) return;
          mainBg.src = img.src;
          mainBg.alt = btn.getAttribute('aria-label') || '';
          qsa('.bento-thumb', gallery).forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        });
      });
    });
  };

  const init = () => {
    initAOS();
    initHeroCanvas();
    initLucide();
    initThemeToggle();
    initYear();
    initMobileNav();
    initAccordion();
    initRoadmap();
    initSkillBars();
    initSkillQuiz();
    initContactForm();
    initChatWidget();
    initResumeDownload();
    initProjectGallery();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
