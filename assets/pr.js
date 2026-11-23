/* Дах та струм — раунд 4: заставка, 3 шапки з професійних фото, одометр, довіра, каталог-список, 3 анімації робіт. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE = (document.currentScript && document.currentScript.src.replace(/pr\.js.*$/, '')) || '../assets/';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var H = function (k) { return BASE + 'hero/' + k + '.webp'; };
  var html = document.documentElement;
  var HERO = [{ k: 'h1', cap: 'Металочерепиця з мансардним фронтоном' }, { k: 'h3', cap: 'Складна покрівля з люкарнами' }, { k: 'h2', cap: 'Монтаж покрівлі на заході сонця' }, { k: 'h4', cap: 'Чисті лінії, точні стики' }];

  /* ---------- заставка ---------- */
  function preloader() {
    var pre = $('#pre'), n = pre && $('.pre-n b', pre), t0 = performance.now(), MIN = reduce ? 0 : 1700, loaded = false;
    function go() { html.classList.add('ready'); }
    if (!pre) { go(); return; }
    addEventListener('load', function () { loaded = true; }); setTimeout(function () { loaded = true; }, 4500);
    (function step(now) {
      var el = now - t0, p = Math.min(loaded ? 100 : 90, el / MIN * 100);
      n.textContent = Math.floor(p);
      if (p < 100) requestAnimationFrame(step);
      else { pre.classList.add('go'); setTimeout(go, 350); setTimeout(function () { pre.remove(); }, 1500); }
    })(t0);
  }

  /* ---------- індикатор кадрів ---------- */
  function dots(n, dur) {
    var d = $('[data-dots]'); if (!d) return function () {};
    d.style.setProperty('--dur', dur / 1000 + 's');
    d.innerHTML = Array(n + 1).join('<i><b></b></i>'); var is = $$('i', d);
    return function (k) { is.forEach(function (x, j) { x.className = j < k ? 'done' : ''; }); void is[k].offsetWidth; is[k].className = 'on'; };
  }
  function cap(t) { var c = $('[data-hcap]'); if (!c) return; c.style.opacity = 0; setTimeout(function () { c.textContent = t; c.style.opacity = 1; }, 300); }

  /* ---------- шапка 1 «Кіно»: перехід у формі даху ---------- */
  function heroKino(host) {
    var DUR = 6500, k = 0, mark = dots(HERO.length, DUR);
    host.style.setProperty('--dur', (DUR + 1600) / 1000 + 's');
    host.innerHTML = '<svg class="k-roof" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M-100 100 L50 -150 L200 100" vector-effect="non-scaling-stroke"/></svg>';
    var roof = $('.k-roof', host);
    function slide(i) { var d = document.createElement('div'); d.className = 'k-s'; d.innerHTML = '<img src="' + H(HERO[i].k) + '" alt="' + esc(HERO[i].cap) + '">'; return d; }
    var base = slide(0); base.classList.add('base'); host.appendChild(base); mark(0); cap(HERO[0].cap);
    if (reduce) return;
    setInterval(function () {
      k = (k + 1) % HERO.length; var top = slide(k); top.classList.add('top'); host.insertBefore(top, roof);
      roof.classList.remove('go'); void roof.offsetWidth; roof.classList.add('go');
      requestAnimationFrame(function () { requestAnimationFrame(function () { top.classList.add('on'); }); });
      mark(k); cap(HERO[k].cap);
      setTimeout(function () { base.remove(); top.classList.remove('top', 'on'); top.classList.add('base'); base = top; }, 1700);
    }, DUR);
  }

  /* ---------- шапка 2 «Колаж» ---------- */
  function heroKolazh(host) {
    var order = ['h2', 'h1', 'h3'], spare = ['h4'], caps = { h1: 'Мансардний фронтон', h2: 'Монтаж на заході сонця', h3: 'Люкарни', h4: 'Точні стики' };
    host.innerHTML = order.map(function (k) { return '<figure data-k="' + k + '"><img class="cu" src="' + H(k) + '" alt="' + caps[k] + '"><img class="nx" alt=""><figcaption>' + caps[k] + '</figcaption></figure>'; }).join('') +
      '<div class="badge"><div><b>0 ₴</b>замір<br>і прорахунок</div></div>';
    var figs = $$('figure', host), j = 1;
    if (!reduce && matchMedia('(pointer:fine)').matches) {
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        figs.forEach(function (f, i) { var s = (i + 1) * 6; $('img.cu', f).style.translate = (-x * s) + 'px ' + (-y * s) + 'px'; });
      });
    }
    if (reduce) return;
    setInterval(function () {
      var f = figs[j % 3]; j++;
      var cur = f.dataset.k, nk = spare.shift(); spare.push(cur);
      var nx = $('img.nx', f), cu = $('img.cu', f); nx.src = H(nk); nx.alt = caps[nk];
      nx.onload = function () { f.classList.add('sw'); $('figcaption', f).textContent = caps[nk]; setTimeout(function () { cu.src = H(nk); f.classList.remove('sw'); f.dataset.k = nk; }, 1100); };
    }, 3800);
  }

  /* ---------- шапка 3 «Дім»: силует логотипа розкривається ---------- */
  function heroDim(host) {
    var DUR = 5500, k = 0, mark = dots(HERO.length, DUR);
    host.innerHTML = '<div class="d-mask">' + HERO.map(function (h, i) { return '<img src="' + H(h.k) + '" alt="' + esc(h.cap) + '"' + (i ? '' : ' class="on"') + '>'; }).join('') + '</div>' +
      '<svg class="d-bolt" viewBox="0 0 30 46" aria-hidden="true"><path d="M20 0 4 24h10l-6 22 18-28H16z"/></svg>';
    var imgs = $$('.d-mask img', host); mark(0); cap(HERO[0].cap);
    if (reduce) return;
    setInterval(function () { imgs[k].classList.remove('on'); k = (k + 1) % imgs.length; imgs[k].classList.add('on'); mark(k); cap(HERO[k].cap); }, DUR);
  }

  /* ---------- одометр ---------- */
  function odometers() {
    $$('[data-odo]').forEach(function (el) {
      var v = el.dataset.odo, u = el.dataset.u || '';
      el.classList.add('odo');
      el.innerHTML = v.split('').map(function (d) { return '<span class="col" data-d="' + d + '">' + '01234567890123456789'.split('').map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</span>'; }).join('') + (u ? '<span class="u">' + u + '</span>' : '');
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; e.target.classList.add('on');
        $$('.col', e.target).forEach(function (c, i) { c.style.transitionDelay = (i * .15) + 's'; c.style.transform = 'translateY(-' + (10 + +c.dataset.d) + 'em)'; });
        io.unobserve(e.target);
      });
    }, { threshold: .4 });
    $$('.stat').forEach(function (s) { io.observe(s); });
  }

  /* ---------- каталог: список + бічна панель (як у варіанті 3) ---------- */
  function catalog() {
    var host = $('[data-clist]'); if (!host || !window.CATALOG) return;
    /* три великі напрями; усе, що стосується даху, — в одній «Покрівлі» з підрозділами */
    var GROUPS = [
      { id: 'roof', name: 'Покрівля', cats: ['roof', 'prof', 'drain', 'parts'] },
      { id: 'facade', name: 'Фасади', cats: ['facade'] },
      { id: 'fence', name: 'Паркани', cats: ['fence'] }
    ];
    host.innerHTML = '<div class="gtabs" role="tablist"><span class="gind"></span></div><div class="subw"><div class="subs"></div></div><div class="list"></div>';
    var gt = $('.gtabs', host), ind = $('.gind', gt), subw = $('.subw', host), subs = $('.subs', host), list = $('.list', host), G = GROUPS[0], sub = 'all';
    var catName = function (id) { return CATS.filter(function (c) { return c.id === id; })[0].name; };
    var inG = function (g) { return CATALOG.filter(function (p) { return g.cats.indexOf(p.cat) > -1; }); };
    GROUPS.forEach(function (g) {
      var b = document.createElement('button'); b.className = 'gt'; b.dataset.id = g.id; b.setAttribute('role', 'tab');
      b.innerHTML = '<b>' + esc(g.name) + '</b><sup>' + inG(g).length + '</sup>'; b.onclick = function () { setG(g); }; gt.appendChild(b);
    });
    function moveInd() { var a = $('.gt.act', gt); if (!a) return; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)'; }
    addEventListener('resize', moveInd);
    function setG(g) {
      G = g; sub = 'all';
      $$('.gt', gt).forEach(function (b) { var on = b.dataset.id === g.id; b.classList.toggle('act', on); b.setAttribute('aria-selected', on); });
      moveInd();
      if (g.cats.length > 1) {
        subs.innerHTML = '';
        [{ id: 'all', name: 'Усе для даху' }].concat(g.cats.map(function (c) { return { id: c, name: catName(c) }; })).forEach(function (c, i) {
          var n = c.id === 'all' ? inG(g).length : CATALOG.filter(function (p) { return p.cat === c.id; }).length;
          var b = document.createElement('button'); b.className = 'chip'; b.dataset.id = c.id; b.style.animationDelay = (120 + i * 70) + 'ms';
          b.innerHTML = esc(c.name) + '<sup>' + n + '</sup>'; b.onclick = function () { setS(c.id); }; subs.appendChild(b);
        });
        subw.classList.add('open');
      } else subw.classList.remove('open');
      setS('all');
    }
    function setS(id) {
      sub = id;
      $$('.chip', subs).forEach(function (c) { c.classList.toggle('act', c.dataset.id === id); });
      var items = inG(G).filter(function (p) { return id === 'all' || p.cat === id; });
      var old = $$('.item', list);
      old.forEach(function (o, i) { o.style.animation = 'none'; o.style.transitionDelay = (i * 25) + 'ms'; o.classList.add('out'); });
      setTimeout(function () {
        list.innerHTML = '';
        items.forEach(function (p, i) {
          var b = document.createElement('button'); b.className = 'item'; b.style.animationDelay = i * 60 + 'ms';
          var sp = p.specs.slice(0, 3).map(function (s) { return '<span>' + esc(s[0]) + '<b>' + esc(s[1]) + '</b></span>'; }).join('') || '<span>Елементів<b>' + (p.items.length || '—') + '</b></span>';
          b.innerHTML = '<span class="th"><img src="' + BASE + 'p/' + p.id + '.webp" alt="' + esc(p.name) + '" loading="lazy"></span><span><small>' + esc(catName(p.cat)) + '</small><h3>' + esc(p.name) + '</h3></span><span class="sp">' + sp + '</span><span class="ar" aria-hidden="true">→</span>';
          b.onclick = function () { openD(p); }; list.appendChild(b);
        });
      }, old.length ? 320 : 0);
    }
    setG(GROUPS[0]); setTimeout(moveInd, 600);
    var drw = document.createElement('aside'), dbg = document.createElement('div');
    drw.className = 'drw'; drw.setAttribute('role', 'dialog'); drw.setAttribute('aria-modal', 'true'); dbg.className = 'dbg';
    document.body.appendChild(dbg); document.body.appendChild(drw);
    function openD(p) {
      var h = '<button class="x" aria-label="Закрити">×</button><div class="pic"><img src="' + BASE + 'p/' + p.id + '.webp" alt="' + esc(p.name) + '"><span class="tint"></span></div><div class="bd"><small>' + esc(CATS.filter(function (c) { return c.id === p.cat; })[0].name) + '</small><h3>' + esc(p.name) + '</h3>';
      p.desc.forEach(function (d) { h += '<p class="d">' + esc(d) + '</p>'; });
      if (p.specs.length) h += '<h4>Технічні характеристики</h4><div class="tbl">' + p.specs.map(function (s) { return '<div><span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b></div>'; }).join('') + '</div>';
      var g = Object.keys(p.colors), k = 0;
      if (g.length) h += '<h4>Палітра — натисніть, щоб приміряти</h4>' + g.map(function (gr) { return '<div class="grp">' + esc(gr) + '</div><div class="ral">' + p.colors[gr].map(function (c) { return '<button style="background:' + swatch(c) + ';animation-delay:' + (k++) * 25 + 'ms" data-n="' + esc(gr + ' · ' + c) + '" data-c="' + esc(c) + '" aria-label="' + esc(gr + ': ' + c) + '"></button>'; }).join('') + '</div>'; }).join('') + '<div class="rn">Оберіть колір</div>';
      if (p.adv.length) h += '<h4>Переваги</h4><ol class="adv">' + p.adv.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ol>';
      if (p.items.length) h += '<h4>Елементи</h4><div class="els">' + p.items.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</div>';
      h += '<a class="btn btn-a" href="#zayavka">Прорахувати з монтажем <svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5"/></svg></a></div>';
      drw.innerHTML = h; drw.scrollTop = 0; drw.setAttribute('aria-label', p.name);
      $('.x', drw).onclick = close; $('.btn', drw).onclick = function () { close(); var q = $('[data-quiz]'); if (q && q._pick) q._pick(p); };
      $$('.ral button', drw).forEach(function (b) { var s = function () { $$('.ral button', drw).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); $('.rn', drw).textContent = b.dataset.n; var t = $('.tint', drw); t.style.background = swatch(b.dataset.c); t.style.opacity = .8; }; b.onclick = s; b.onmouseenter = s; });
      drw.classList.add('open'); dbg.classList.add('open'); html.style.overflow = 'hidden'; $('.x', drw).focus();
    }
    function close() { drw.classList.remove('open'); dbg.classList.remove('open'); html.style.overflow = ''; }
    dbg.onclick = close; addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- роботи: спільне ---------- */
  var T = function (id) { return BASE + 't/' + id + '.webp'; }, Wf = function (id) { return BASE + 'w/' + id + '.webp'; };
  function cursor() {
    if (!matchMedia('(pointer:fine)').matches) return;
    var c = document.createElement('div'); c.className = 'cur'; c.textContent = 'ДИВИТИСЬ'; document.body.appendChild(c);
    var x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; c.classList.toggle('on', !!(e.target.closest && e.target.closest('.wkc'))); });
    (function f() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.translate = cx + 'px ' + cy + 'px'; requestAnimationFrame(f); })();
  }
  /* роботи — ті самі великі напрями: навіси й гаражі йдуть разом із парканами */
  var WG = [{ id: 'all', name: 'Усі роботи', t: [] }, { id: 'roof', name: 'Покрівля', t: ['roof'] }, { id: 'facade', name: 'Фасади', t: ['facade'] }, { id: 'fence', name: 'Паркани та навіси', t: ['fence', 'metal'] }];
  var gOf = function (w) { for (var i = 1; i < WG.length; i++) if (WG[i].t.indexOf(w.tags[0]) > -1) return WG[i]; return WG[1]; };
  function card(w, i) {
    var tag = gOf(w).name;
    return '<button class="wkc" data-w="' + w.id + '" style="--i:' + i + '"><img src="' + T(w.photos[0]) + '" alt="' + esc(w.title) + '" loading="lazy"><span class="c">' + w.photos.length + ' фото</span><span class="vt">' + esc(w.title) + '</span><span class="m"><small>' + tag + '</small><h3>' + esc(w.title) + '</h3></span></button>';
  }
  function chips(host, onSet) {
    var f = document.createElement('div'); f.className = 'wk-f'; f.setAttribute('role', 'tablist');
    WG.forEach(function (c) {
      var n = pick(c.id).length;
      var b = document.createElement('button'); b.className = 'chip'; b.dataset.id = c.id; b.setAttribute('role', 'tab'); b.innerHTML = esc(c.name) + '<sup>' + n + '</sup>';
      b.onclick = function () { $$('.chip', f).forEach(function (x) { x.classList.toggle('act', x === b); x.setAttribute('aria-selected', x === b); }); onSet(c.id); }; f.appendChild(b);
    });
    host.appendChild(f); $('.chip', f).classList.add('act');
  }
  var pick = function (id) { var g = WG.filter(function (x) { return x.id === id; })[0]; return WORKS.filter(function (w) { return id === 'all' || w.tags.some(function (t) { return g.t.indexOf(t) > -1; }); }); };
  var open = function (id) { var w = WORKS.filter(function (x) { return x.id === id; })[0]; if (w && window.DTS) DTS.openLb(w, 0); };

  /* роботи 1: мозаїка, кожна картка відкривається шторкою */
  function worksMosaic(host) {
    var grid = document.createElement('div'); grid.className = 'mos';
    /* clip-path обнуляє перетин для IntersectionObserver, тому перевіряємо позицію самі */
    var io = { observe: function () { chk(); } };
    function chk() {
      $$('.wkc:not(.in):not(.q)', grid).forEach(function (el, n) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight * .92 && r.bottom > 0) { el.classList.add('q'); setTimeout(function () { el.classList.add('in'); el.classList.remove('q'); }, (n % 4) * 110); }
      });
    }
    addEventListener('scroll', chk, { passive: true }); addEventListener('resize', chk);
    function render(id) {
      var old = $$('.wkc', grid);
      old.forEach(function (c) { c.classList.remove('in'); });
      setTimeout(function () {
        grid.innerHTML = pick(id).map(card).join('');
        $$('.wkc', grid).forEach(function (c) { c.onclick = function () { open(c.dataset.w); }; io.observe(c); });
      }, old.length ? 500 : 0);
    }
    chips(host, render); host.appendChild(grid); render('all');
  }

  /* роботи 2: гармошка — панелі розкриваються одна за одною */
  function worksAccordion(host) {
    var box = document.createElement('div'); box.className = 'acc';
    var nav = document.createElement('div'); nav.className = 'acc-nav'; nav.innerHTML = '<span class="ac-t"></span><span><button class="ac-p" aria-label="Попередній об\'єкт">←</button><button class="ac-n" aria-label="Наступний об\'єкт">→</button></span>';
    var list = [], cur = 0, auto = null, user = false;
    function openI(i) {
      cur = (i + list.length) % list.length;
      $$('.wkc', box).forEach(function (c, j) { c.classList.toggle('op', j === cur); });
      $('.ac-t', nav).textContent = ('0' + (cur + 1)).slice(-2) + ' / ' + ('0' + list.length).slice(-2) + ' — ' + list[cur].note;
    }
    function render(id) {
      list = pick(id).slice(0, 8); box.classList.remove('in');
      box.innerHTML = list.map(card).join('');
      $$('.wkc', box).forEach(function (c, j) {
        c.style.transitionDelay = (j * 60) + 'ms, ' + (j * 60) + 'ms, ' + (j * 60) + 'ms';
        c.onmouseenter = function () { if (matchMedia('(pointer:fine)').matches) { user = true; openI(j); } };
        c.onclick = function () { if (j === cur) open(c.dataset.w); else { user = true; openI(j); } };
      });
      openI(0); requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('in'); }); });
    }
    chips(host, render); host.appendChild(box); host.appendChild(nav); render('all');
    $('.ac-p', nav).onclick = function () { user = true; openI(cur - 1); }; $('.ac-n', nav).onclick = function () { user = true; openI(cur + 1); };
    if (!reduce) auto = setInterval(function () { if (!user) openI(cur + 1); }, 3200);
  }

  /* роботи 3: 3D-кільце, яке крутиться пальцем або мишкою */
  function worksRing(host) {
    var wrapE = document.createElement('div'); wrapE.className = 'ring-w';
    var ring = document.createElement('div'); ring.className = 'ring'; wrapE.appendChild(ring);
    var ctl = document.createElement('div'); ctl.className = 'ring-ctl'; ctl.innerHTML = '<button aria-label="Попередній об\'єкт">←</button><span></span><button aria-label="Наступний об\'єкт">→</button>';
    var list = [], ang = 0, target = 0, step = 0, R = 0, drag = false, sx = 0, sa = 0, moved = 0, lastUser = 0;
    function layout() {
      var w = wrapE.clientWidth < 700 ? 220 : 300; step = 360 / Math.max(list.length, 6);
      R = Math.round((w / 2) / Math.tan(Math.PI / Math.max(list.length, 6))) + 40;
      $$('.wkc', ring).forEach(function (c, i) { c.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + R + 'px)'; });
    }
    function render(id) {
      list = pick(id); ring.innerHTML = list.map(card).join(''); ang = target = 0; layout();
      $$('.wkc', ring).forEach(function (c, i) { c.onclick = function () { if (moved > 6) return; if (front() === i) open(c.dataset.w); else { target = -i * step; lastUser = Date.now(); } }; });
    }
    function front() { var n = list.length; return ((Math.round(-ang / step) % n) + n) % n; }
    function frame() {
      if (!drag && Date.now() - lastUser > 4000 && !reduce) target -= 0.06;
      ang += (target - ang) * 0.08;
      ring.style.transform = 'translateZ(-' + R + 'px) rotateY(' + ang + 'deg)';
      var f = front();
      $$('.wkc', ring).forEach(function (c, i) { c.classList.toggle('far', i !== f); });
      if (list[f]) $('span', ctl).textContent = list[f].title;
      requestAnimationFrame(frame);
    }
    wrapE.addEventListener('pointerdown', function (e) { drag = true; moved = 0; sx = e.clientX; sa = target; lastUser = Date.now(); });
    addEventListener('pointermove', function (e) { if (!drag) return; moved = Math.abs(e.clientX - sx); target = sa + (e.clientX - sx) * 0.25; lastUser = Date.now(); });
    addEventListener('pointerup', function () { if (drag) { drag = false; target = Math.round(target / step) * step; lastUser = Date.now(); } });
    $$('button', ctl)[0].onclick = function () { target = Math.round(target / step) * step + step; lastUser = Date.now(); };
    $$('button', ctl)[1].onclick = function () { target = Math.round(target / step) * step - step; lastUser = Date.now(); };
    chips(host, render); host.appendChild(wrapE); host.appendChild(ctl); render('all');
    addEventListener('resize', layout); frame();
  }

  function init() {
    var h = $('[data-hero]'); if (h) ({ kino: heroKino, kolazh: heroKolazh, dim: heroDim })[h.dataset.hero](h);
    odometers(); catalog();
    var w = $('[data-wmode]'); if (w) ({ mosaic: worksMosaic, accordion: worksAccordion, ring: worksRing })[w.dataset.wmode](w);
    cursor(); preloader();
    var mq = $('#mq'); if (mq) { var words = ['Покрівля', 'Утеплення', 'Підшива', 'Водостік', 'Фасади', 'Навіси', 'Паркани', 'Електромонтаж']; var r = words.map(function (x, i) { return '<span class="' + (i % 2 ? 'o' : '') + '">' + x + '</span>'; }).join(''); mq.innerHTML = r + r; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
