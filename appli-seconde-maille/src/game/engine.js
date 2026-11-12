/* =====================================================================
   Moteur du jeu « Maille à part » — canvas 2D, sans dépendance.
   Décor repris du header du site : ciel, nuages, silhouette de Roubaix,
   houle, bateau de récupération, fond marin. Le vaquita esquive les
   filets égarés (dérivants, rideaux tombant de la surface, filets ancrés)
   et attrape des bulles d'air.
   ===================================================================== */
const SRC = {
  sky: '/game/sky.svg',
  clouds: '/game/clouds.svg',
  city: '/game/city.svg',
  net: '/game/net-drift.svg',
  vaquita: '/game/vaquita.svg',
  boat: '/game/boat.svg'
};

export function loadAssets() {
  const entries = Object.entries(SRC).map(
    ([k, src]) =>
      new Promise((res) => {
        const img = new Image();
        img.onload = () => res([k, img]);
        img.onerror = () => res([k, null]);
        img.src = src;
      })
  );
  return Promise.all(entries).then((l) => Object.fromEntries(l));
}

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createGame(canvas, assets, { lives = 3, onHud, onOver, reducedMotion = false } = {}) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, running = false;

  const S = {
    phase: 'ready', // ready | playing | paused | over
    t: 0, // temps de survie
    scroll: 0,
    speed: 230,
    lives,
    bubbles: 0,
    inv: 0, // invincibilité après un choc
    shake: 0,
    spawnIn: 0.9,
    bubbleIn: 1.6,
    boatX: null,
    obs: [],
    bubs: [],
    fx: [], // éclats / bulles décor
    deco: [],
    v: { x: 0, y: 0, vy: 0, target: 0, w: 86, h: 48 }
  };

  /* ---------------- dimensions ---------------- */
  const horizon = () => Math.round(H * 0.3);
  const top = () => horizon() + 26;
  const bottom = () => H - 34;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S.v.w = clamp(W * 0.22, 70, 110);
    S.v.h = S.v.w * (200 / 360);
    S.v.x = W * 0.24;
    if (!S.v.y) S.v.y = S.v.target = (top() + bottom()) / 2;
    if (!S.deco.length)
      for (let i = 0; i < 26; i++) S.deco.push({ x: rand(0, W), y: rand(horizon(), H), r: rand(1, 3.4), s: rand(10, 30) });
    draw();
  }

  /* ---------------- commandes ---------------- */
  function setTarget(clientY) {
    const r = canvas.getBoundingClientRect();
    S.v.target = clamp(clientY - r.top, top() + S.v.h * 0.4, bottom() - S.v.h * 0.4);
  }
  const keys = { up: false, down: false };
  function onPointer(e) {
    if (S.phase !== 'playing') return;
    setTarget(e.clientY);
  }
  function onKey(e) {
    const down = e.type === 'keydown';
    if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) keys.up = down;
    else if (['ArrowDown', 'KeyS'].includes(e.code)) keys.down = down;
    else return;
    e.preventDefault();
  }
  canvas.addEventListener('pointerdown', onPointer);
  canvas.addEventListener('pointermove', onPointer);
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);

  /* ---------------- apparitions ---------------- */
  function spawnObstacle() {
    const t = S.t;
    const pick = Math.random();
    const playH = bottom() - top();
    if (pick < 0.38 || t < 3) {
      // filet dérivant
      const w = rand(96, 130);
      const h = w * (120 / 260);
      S.obs.push({ kind: 'drift', x: W + 40, y: rand(top() + h / 2, bottom() - h / 2), w, h, ph: rand(0, 6), bob: rand(14, 34), sp: rand(1, 1.4), rot: rand(-0.2, 0.2), vy: t > 8 ? rand(-1, 1) * Math.min(90, 30 + t * 1.5) : 0 });
    } else if (pick < 0.72) {
      // rideau qui tombe de la surface
      const len = playH * rand(0.4, 0.62 + Math.min(0.14, t / 200));
      S.obs.push({ kind: 'curtain', x: W + 30, y0: horizon() + 4, y1: horizon() + 4 + len, w: rand(44, 62), ph: rand(0, 6), sp: 1 });
    } else {
      // filet ancré au fond
      const len = playH * rand(0.38, 0.6 + Math.min(0.14, t / 200));
      S.obs.push({ kind: 'anchor', x: W + 30, y0: H - len - 6, y1: H - 6, w: rand(44, 62), ph: rand(0, 6), sp: 1 });
    }
    // à partir de 25 s, parfois un duo surface + fond avec un passage
    if (t > 12 && Math.random() < Math.min(0.6, (t - 12) / 50)) {
      const gap = clamp(S.v.h * 2.3 - (t - 12) * 0.6, S.v.h * 1.6, S.v.h * 2.3);
      const gy = rand(top() + gap / 2 + 20, bottom() - gap / 2 - 20);
      const x = W + 220;
      S.obs.push({ kind: 'curtain', x, y0: horizon() + 4, y1: gy - gap / 2, w: 50, ph: rand(0, 6), sp: 1 });
      S.obs.push({ kind: 'anchor', x: x + 6, y0: gy + gap / 2, y1: H - 6, w: 50, ph: rand(0, 6), sp: 1 });
    }
  }
  function spawnBubble() {
    const n = Math.random() < 0.3 ? 3 : 1;
    const y = rand(top() + 20, bottom() - 20);
    for (let i = 0; i < n; i++) S.bubs.push({ x: W + 30 + i * 34, y: y + Math.sin(i) * 16, r: 9, ph: rand(0, 6) });
  }

  /* ---------------- collisions (ellipse vaquita / rectangle) ---------------- */
  function hitRect(cx, cy, rx, ry, x0, y0, x1, y1) {
    const px = clamp(cx, x0, x1);
    const py = clamp(cy, y0, y1);
    const dx = (px - cx) / rx;
    const dy = (py - cy) / ry;
    return dx * dx + dy * dy < 1;
  }
  function obstacleBox(o) {
    if (o.kind === 'drift') {
      const y = o.y + Math.sin(S.t * 1.6 + o.ph) * o.bob * 0.4;
      return [o.x + o.w * 0.12, y - o.h * 0.32, o.x + o.w * 0.88, y + o.h * 0.32];
    }
    return [o.x + o.w * 0.15, o.y0, o.x + o.w * 0.85, o.y1];
  }

  /* ---------------- mise à jour ---------------- */
  function update(dt) {
    S.t += dt;
    S.speed = Math.min(560, 230 + S.t * 8);
    const dx = S.speed * dt;
    S.scroll += dx;

    // vaquita
    const v = S.v;
    if (keys.up) v.target -= 300 * dt;
    if (keys.down) v.target += 300 * dt;
    v.target = clamp(v.target, top() + v.h * 0.4, bottom() - v.h * 0.4);
    const prev = v.y;
    v.y += (v.target - v.y) * Math.min(1, dt * 6);
    v.vy = (v.y - prev) / Math.max(dt, 0.001);
    if (S.inv > 0) S.inv -= dt;
    if (S.shake > 0) S.shake -= dt;

    // apparitions
    S.spawnIn -= dt;
    if (S.spawnIn <= 0) {
      spawnObstacle();
      S.spawnIn = Math.max(0.42, 1.2 - S.t * 0.022) * rand(0.75, 1.1);
    }
    S.bubbleIn -= dt;
    if (S.bubbleIn <= 0) {
      spawnBubble();
      S.bubbleIn = rand(2.4, 3.8);
    }

    // obstacles
    const rx = v.w * 0.4, ry = v.h * 0.34;
    const cx = v.x + v.w * 0.52, cy = v.y + v.h * 0.06;
    for (const o of S.obs) {
      o.x -= dx * o.sp;
      if (o.vy) {
        // les filets dérivants remontent / plongent et rebondissent sur les bords
        o.y += o.vy * dt;
        if (o.y < top() + o.h / 2 || o.y > bottom() - o.h / 2) {
          o.vy *= -1;
          o.y = clamp(o.y, top() + o.h / 2, bottom() - o.h / 2);
        }
      }
      if (S.inv <= 0 && !o.hit) {
        const [x0, y0, x1, y1] = obstacleBox(o);
        if (hitRect(cx, cy, rx, ry, x0, y0, x1, y1)) {
          o.hit = true;
          S.lives -= 1;
          S.inv = 0.9;
          S.shake = reducedMotion ? 0 : 0.35;
          for (let i = 0; i < 10; i++) S.fx.push({ x: cx, y: cy, vx: rand(-120, 60), vy: rand(-110, 110), life: 0.7, r: rand(2, 5), c: '#ffffff' });
          navigator.vibrate?.(60);
          if (S.lives <= 0) return end();
        }
      }
    }
    S.obs = S.obs.filter((o) => o.x > -o.w - 160);

    // bulles à attraper
    for (const b of S.bubs) {
      b.x -= dx;
      const by = b.y + Math.sin(S.t * 3 + b.ph) * 6;
      const ddx = (b.x - cx) / (rx + b.r), ddy = (by - cy) / (ry + b.r);
      if (!b.got && ddx * ddx + ddy * ddy < 1) {
        b.got = true;
        S.bubbles += 1;
        for (let i = 0; i < 6; i++) S.fx.push({ x: b.x, y: by, vx: rand(-60, 60), vy: rand(-90, 10), life: 0.5, r: rand(2, 4), c: '#bae3d1' });
      }
    }
    S.bubs = S.bubs.filter((b) => b.x > -30 && !b.got);

    // effets
    for (const p of S.fx) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    S.fx = S.fx.filter((p) => p.life > 0);
    for (const d of S.deco) {
      d.y -= d.s * dt;
      d.x -= dx * 0.25;
      if (d.y < horizon() + 6 || d.x < -5) {
        d.y = H + rand(0, 40);
        d.x = rand(0, W * 1.2);
      }
    }

    // bateau de récupération en surface
    if (S.boatX == null || S.boatX < -260) S.boatX = W + rand(200, 900);
    S.boatX -= dx * 0.35;
  }

  function end() {
    S.phase = 'over';
    hud(true);
    onOver?.({ seconds: S.t, bubbles: S.bubbles });
  }

  /* ---------------- dessin ---------------- */
  function tile(img, factor, y, h, tw) {
    if (!img) return;
    const off = -((S.scroll * factor) % tw);
    for (let x = off; x < W; x += tw) ctx.drawImage(img, x, y, tw + 1, h);
  }

  function drawNetMesh(x, y0, y1, w, ph, fromTop) {
    const sway = Math.sin(S.t * 1.4 + ph) * 6;
    const len = y1 - y0;
    const cols = 5;
    const rows = Math.max(3, Math.round(len / 18));
    const P = (i, j) => {
      const fy = j / rows;
      const k = fromTop ? fy : 1 - fy; // le bout libre ondule le plus
      return [x + (i / cols) * w + sway * k + Math.sin(S.t * 2 + ph + j * 0.6) * 2 * k, y0 + fy * len];
    };
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 246, 240, 0.78)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const [px, py] = P(i, j);
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        const [px, py] = P(i, j);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    // corde porteuse + flotteurs bleus / plombs
    ctx.strokeStyle = '#0F2926';
    ctx.lineWidth = 3;
    const ry = fromTop ? y0 : y1;
    ctx.beginPath();
    ctx.moveTo(x - 4, ry);
    ctx.lineTo(x + w + 4, ry);
    ctx.stroke();
    for (let i = 0; i <= cols; i += 2) {
      const [px] = P(i, fromTop ? 0 : rows);
      ctx.fillStyle = fromTop ? '#194080' : '#0F2926';
      ctx.beginPath();
      if (fromTop) ctx.ellipse(px, ry, 7, 5, 0, 0, Math.PI * 2);
      else ctx.rect(px - 5, ry - 6, 10, 8);
      ctx.fill();
    }
    // déchet accroché
    ctx.fillStyle = 'rgba(186, 227, 209, 0.9)';
    const [tx, ty] = P(2, Math.floor(rows * 0.6));
    ctx.fillRect(tx - 4, ty - 3, 8, 6);
    ctx.restore();
  }

  function draw() {
    if (!W) return;
    const hz = horizon();
    ctx.save();
    if (S.shake > 0) ctx.translate(rand(-5, 5), rand(-4, 4));

    // ciel + nuages + Roubaix
    if (assets.sky) ctx.drawImage(assets.sky, 0, 0, W, hz + 10);
    else {
      ctx.fillStyle = '#dff1ea';
      ctx.fillRect(0, 0, W, hz + 10);
    }
    tile(assets.clouds, 0.06, H * 0.02, hz * 0.55, Math.max(W * 2.2, 800));
    const cityH = hz * 0.42;
    tile(assets.city, 0.12, hz - cityH + 6, cityH, Math.max(W * 2.6, 900));

    // bateau qui récupère les filets
    if (assets.boat && S.boatX != null) {
      const bw = clamp(W * 0.42, 140, 220), bh = bw * (300 / 520);
      ctx.drawImage(assets.boat, S.boatX, hz - bh * 0.78 + Math.sin(S.t * 1.8) * 2, bw, bh);
    }

    // eau
    const g = ctx.createLinearGradient(0, hz, 0, H);
    g.addColorStop(0, '#2aa79a');
    g.addColorStop(0.35, '#0D9488');
    g.addColorStop(0.75, '#0e5e63');
    g.addColorStop(1, '#0F2926');
    ctx.fillStyle = g;
    ctx.fillRect(0, hz, W, H - hz);
    // ligne de surface ondulée
    ctx.fillStyle = 'rgba(186, 227, 209, 0.55)';
    ctx.beginPath();
    ctx.moveTo(0, hz - 4);
    for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, hz + 3 + Math.sin((x + S.scroll * 0.6) / 34) * 3);
    for (let x = W + 10; x >= 0; x -= 10) ctx.lineTo(x, hz + 12 + Math.sin((x + S.scroll * 0.6) / 34 + 1) * 3);
    ctx.fill();

    // rayons de lumière
    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const x = ((i * W) / 3 - (S.scroll * 0.05) % (W / 3)) + Math.sin(S.t * 0.4 + i) * 20;
      ctx.beginPath();
      ctx.moveTo(x, hz);
      ctx.lineTo(x + 50, hz);
      ctx.lineTo(x + 170, H);
      ctx.lineTo(x + 70, H);
      ctx.fill();
    }
    ctx.restore();

    // micro-bulles décor
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    for (const d of S.deco) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // fond sableux
    ctx.fillStyle = '#0b2421';
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, H - 14 - Math.sin((x + S.scroll) / 60) * 6);
    ctx.lineTo(W, H);
    ctx.fill();

    // bulles à attraper
    for (const b of S.bubs) {
      const by = b.y + Math.sin(S.t * 3 + b.ph) * 6;
      ctx.fillStyle = 'rgba(186, 227, 209, 0.35)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, by, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(b.x - 3, by - 3, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // filets
    for (const o of S.obs) {
      if (o.kind === 'drift') {
        const y = o.y + Math.sin(S.t * 1.6 + o.ph) * o.bob * 0.4;
        ctx.save();
        ctx.translate(o.x + o.w / 2, y);
        ctx.rotate(o.rot + Math.sin(S.t + o.ph) * 0.08);
        if (assets.net) ctx.drawImage(assets.net, -o.w / 2, -o.h / 2, o.w, o.h);
        ctx.restore();
      } else drawNetMesh(o.x, o.y0, o.y1, o.w, o.ph, o.kind === 'curtain');
    }

    // vaquita (le dessin regarde à gauche : on le retourne)
    const v = S.v;
    const blink = S.inv > 0 && Math.floor(S.inv * 10) % 2 === 0;
    if (!blink) {
      ctx.save();
      ctx.translate(v.x + v.w / 2, v.y + Math.sin(S.t * 5) * (S.phase === 'playing' ? 1.5 : 3));
      ctx.rotate(clamp(v.vy / 900, -0.35, 0.35));
      ctx.scale(-1, 1);
      if (assets.vaquita) ctx.drawImage(assets.vaquita, -v.w / 2, -v.h / 2, v.w, v.h);
      ctx.restore();
    }

    // éclats
    for (const p of S.fx) {
      ctx.globalAlpha = Math.max(0, p.life * 1.6);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // houle de premier plan
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W + 10; x += 8) {
      const y = hz + 2 + Math.sin((x + S.scroll * 0.9) / 26) * 2.5;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ---------------- boucle ---------------- */
  let hudT = 0;
  function hud(force) {
    hudT = 0;
    onHud?.({ seconds: S.t, bubbles: S.bubbles, lives: S.lives, speed: S.speed, force });
  }
  function frame(ts) {
    if (!running) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000);
    last = ts;
    if (S.phase === 'playing') {
      update(dt);
      hudT += dt;
      if (hudT > 0.1) hud();
    } else if (S.phase === 'ready') {
      S.scroll += 40 * dt; // le décor défile doucement, le chrono attend le départ
      S.idle = (S.idle || 0) + dt;
      S.v.y = S.v.target + Math.sin(S.idle * 2) * 8;
      if (S.boatX == null) S.boatX = W * 0.62;
      for (const d of S.deco) {
        d.y -= d.s * dt;
        if (d.y < horizon() + 6) d.y = H;
      }
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function loop(on) {
    if (on && !running) {
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    } else if (!on) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  loop(true);

  return {
    start() {
      S.phase = 'playing';
      hud(true);
    },
    pause() {
      if (S.phase === 'playing') S.phase = 'paused';
    },
    resume() {
      if (S.phase === 'paused') {
        S.phase = 'playing';
        last = 0;
      }
    },
    get phase() {
      return S.phase;
    },
    destroy() {
      loop(false);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('pointermove', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    }
  };
}
