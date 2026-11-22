/* Дах та струм — раунд 3: заставка відкриття, анімації як на phservs.com, три шапки за пінами, галерея об'єктів. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE = (document.currentScript && document.currentScript.src.replace(/ph\.js.*$/, '')) || '../assets/';
  var W = function (id) { return BASE + 'w/' + id + '.webp'; };
  var T = function (id) { return BASE + 't/' + id + '.webp'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var html = document.documentElement;

  /* ---------- 1. Заставка відкриття сторінки ---------- */
  function preloader(done) {
    var pre = $('#pre'); if (!pre) { done(); return; }
    var num = $('.pre-n', pre), bar = $('.pre-bar i', pre), t0 = performance.now(), MIN = reduce ? 0 : 1600, loaded = false;
    addEventListener('load', function () { loaded = true; });
    setTimeout(function () { loaded = true; }, 4500);
    (function step(now) {
      var el = now - t0, target = loaded ? 100 : Math.min(88, el / 25);
      var p = Math.min(target, el / MIN * 100);
      if (num) num.textContent = ('0' + Math.floor(p)).slice(-2).replace(/^0(?=\d\d)/, '') + (p >= 100 ? '' : '');
      if (num && p >= 100) num.textContent = '100';
      if (bar) bar.style.transform = 'scaleX(' + p / 100 + ')';
      if (p < 100) requestAnimationFrame(step);
      else { pre.classList.add('out'); setTimeout(function () { html.classList.add('loaded'); done(); }, 650); setTimeout(function () { pre.remove(); }, 1600); }
    })(t0);
  }

  /* ---------- 2. Анімації появи, як на phservs (framer-motion) ---------- */
  function counters(root) {
    $$('[data-count]', root).forEach(function (el) {
      var t = +el.dataset.count, s; if (!t) { el.textContent = '0'; return; }
      (function f(ts) { s = s || ts; var p = Math.min((ts - s) / 1800, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(performance.now());
    });
  }
  function reveal() {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('in'); counters(e.target); io.unobserve(e.target); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    // стагер: діти групи [data-stagger] отримують затримку 0.1 c
    $$('[data-stagger]').forEach(function (g) { $$('[data-a]', g).forEach(function (el, i) { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * 0.1) + 's'); }); });
    $$('[data-a]').forEach(function (el) { if (!el.closest('.hero')) io.observe(el); });
  }

  /* ---------- 3. Паралакс шапки, нахил карток ---------- */
  function scrollFx() {
    var par = $$('[data-par]'), heroC = $('[data-hero-c]'), tk = false;
    function f() {
      var y = scrollY, h = innerHeight;
      if (y < h * 1.3) {
        par.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * 0.3) + 'px,0) scale(' + (1 + y / h * 0.08) + ')'; });
        if (heroC) { heroC.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)'; heroC.style.opacity = Math.max(0, 1 - y / (h * 0.75)); }
      }
      tk = false;
    }
    addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(f); } }, { passive: true }); f();
    if (reduce || !matchMedia('(pointer:fine)').matches) return;
    $$('[data-tilt]').forEach(function (c) {
      c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'perspective(800px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 6) + 'deg)'; });
      c.addEventListener('mouseleave', function () { c.style.transform = 'perspective(800px)'; });
    });
  }

  /* ---------- 4. Шапка A: шторм → сонце (пін 1) ---------- */
  function heroStorm(host) {
    var shots = (host.dataset.shots || '45|40|24').split('|'), k = 0;
    host.innerHTML = '<div class="st-l st-sun"><img alt=""></div><div class="st-l st-storm"><img alt=""><canvas></canvas><i class="st-flash"></i></div><i class="st-wipe"></i>';
    var sun = $('.st-sun', host), storm = $('.st-storm', host), si = $('img', sun), ti = $('img', storm), cv = $('canvas', storm), fl = $('.st-flash', storm), wipe = $('.st-wipe', host);
    var lab = $('[data-storm-lab]'), cx = cv.getContext('2d'), drops = [], Wd, Hd;
    function size() { Wd = cv.width = host.clientWidth; Hd = cv.height = host.clientHeight; drops = []; for (var i = 0; i < Math.min(820, Wd * Hd / 1700); i++) drops.push({ x: Math.random() * Wd, y: Math.random() * Hd, l: 12 + Math.random() * 26, v: 14 + Math.random() * 16, o: .25 + Math.random() * .45 }); }
    size(); addEventListener('resize', size);
    var raining = true;
    (function rain() {
      if (raining) {
        cx.clearRect(0, 0, Wd, Hd); cx.lineWidth = 1.4; cx.lineCap = 'round';
        for (var i = 0; i < drops.length; i++) {
          var d = drops[i]; cx.strokeStyle = 'rgba(210,225,255,' + d.o + ')'; cx.beginPath(); cx.moveTo(d.x, d.y); cx.lineTo(d.x - d.l * .18, d.y + d.l); cx.stroke();
          d.y += d.v; d.x -= d.v * .18; if (d.y > Hd) { d.y = -d.l; d.x = Math.random() * (Wd + 200); }
        }
      }
      requestAnimationFrame(rain);
    })();
    function load(i) { var p = shots[i % shots.length]; si.src = W(p); ti.src = W(p); }
    function cycle() {
      load(k); host.classList.remove('sunny'); storm.style.clipPath = 'inset(0 0 0 0)'; raining = true;
      if (lab) lab.textContent = lab.dataset.t1; document.body.classList.remove('sunny-on');
      // блискавка
      setTimeout(function () { fl.classList.add('on'); setTimeout(function () { fl.classList.remove('on'); }, 160); setTimeout(function () { fl.classList.add('on'); setTimeout(function () { fl.classList.remove('on'); }, 90); }, 260); }, 1300);
      // перехід: шторка світла зліва направо
      setTimeout(function () {
        host.classList.add('wiping');
        var t0 = performance.now(), D = 1300;
        (function w(now) {
          var p = Math.min((now - t0) / D, 1), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          storm.style.clipPath = 'inset(0 0 0 ' + (e * 100) + '%)'; wipe.style.left = (e * 100) + '%';
          if (p < 1) requestAnimationFrame(w); else { raining = false; host.classList.remove('wiping'); host.classList.add('sunny'); if (lab) lab.textContent = lab.dataset.t2; document.body.classList.add('sunny-on'); }
        })(t0);
      }, 3400);
      setTimeout(function () { k++; cycle(); }, 10500);
    }
    if (reduce) { load(0); host.classList.add('sunny'); storm.style.clipPath = 'inset(0 0 0 100%)'; return; }
    cycle();
  }

  /* ---------- 5. Шапка B: майстер у роботі / точність (пін 2) ---------- */
  function heroCraft(host) {
    var S = [
      { p: '45', pts: [[.30, .38, 'Модуль хвилі — 350 мм'], [.62, .56, 'Метал 0,40–0,50 мм'], [.44, .76, 'Кут нахилу від 14°']] },
      { p: '34', pts: [[.35, .40, 'Підшива звисів'], [.66, .60, 'Вентиляція покрівлі'], [.48, .80, 'Водостічна система']] },
      { p: '42', pts: [[.40, .34, 'Ендова — герметичний стик'], [.68, .58, 'Коньок і планки'], [.30, .74, 'Від −50 до +120 °C']] }
    ], k = 0;
    host.innerHTML = '<div class="cr-cam"><img class="cr-a" alt=""><img class="cr-b" alt=""></div><svg class="cr-svg" aria-hidden="true"></svg><div class="cr-tags"></div><i class="cr-rec"><b></b>REC</i>';
    var a = $('.cr-a', host), b = $('.cr-b', host), svg = $('.cr-svg', host), tags = $('.cr-tags', host), front = a, back = b;
    function show() {
      var s = S[k % S.length]; back.src = W(s.p); back.classList.add('on'); front.classList.remove('on'); var t = front; front = back; back = t;
      svg.innerHTML = ''; tags.innerHTML = '';
      s.pts.forEach(function (pt, i) {
        setTimeout(function () {
          var w = host.clientWidth, h = host.clientHeight, x = pt[0] * w, y = pt[1] * h, ex = x + (x > w * .5 ? -1 : 1) * Math.min(160, w * .18), ey = y - 70;
          var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.innerHTML = '<circle cx="' + x + '" cy="' + y + '" r="5" class="cr-dot"/><circle cx="' + x + '" cy="' + y + '" r="16" class="cr-ring"/><path class="cr-line" d="M' + x + ' ' + y + ' L' + ex + ' ' + ey + '"/>';
          svg.appendChild(g);
          var tg = document.createElement('span'); tg.className = 'cr-tag'; tg.textContent = pt[2]; tg.style.left = ex + 'px'; tg.style.top = ey + 'px'; if (x > w * .5) tg.classList.add('l');
          tags.appendChild(tg); requestAnimationFrame(function () { g.classList.add('on'); tg.classList.add('on'); });
        }, 900 + i * 900);
      });
      k++;
    }
    show(); if (!reduce) setInterval(show, 7000);
    addEventListener('resize', function () { svg.setAttribute('viewBox', '0 0 ' + host.clientWidth + ' ' + host.clientHeight); });
    svg.setAttribute('viewBox', '0 0 ' + host.clientWidth + ' ' + host.clientHeight);
  }

  /* ---------- 6. Шапка C: дрон + розділення на 3 кадри (пін 3) ---------- */
  function heroSplit(host) {
    var mob = matchMedia('(max-width:700px) and (orientation:portrait)').matches, name = mob ? 'hero-m' : 'hero';
    var src = BASE + 'video/' + name + '.mp4', poster = BASE + 'video/' + name + '-poster.jpg';
    var offs = [0, 7.2, 14.6];
    host.innerHTML = offs.map(function (o, i) { return '<div class="sp-p sp-' + i + '"><video muted playsinline loop preload="auto" poster="' + poster + '" src="' + src + '"></video></div>'; }).join('');
    var vids = $$('video', host);
    vids.forEach(function (v, i) { v.addEventListener('loadedmetadata', function () { try { v.currentTime = offs[i]; } catch (_) {} }, { once: true }); var p = v.play(); if (p && p.catch) p.catch(function () {}); });
    if (reduce) return;
    function loop() {
      host.classList.remove('split');
      setTimeout(function () { host.classList.add('split'); }, 5200);
      setTimeout(loop, 11500);
    }
    loop();
    document.addEventListener('visibilitychange', function () { vids.forEach(function (v) { if (document.hidden) v.pause(); else { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }); });
  }

  /* ---------- 7. Галерея об'єктів (як на сторінках phservs) ---------- */
  function gallery() {
    var host = $('[data-gallery]'); if (!host || !window.WORKS) return;
    var all = []; WORKS.forEach(function (w) { w.photos.forEach(function (p) { all.push({ p: p, w: w }); }); });
    host.innerHTML = '<div class="gl-chips" role="tablist"></div><div class="gl"><div class="gl-st"><img alt=""><button class="gl-a gl-p" aria-label="Попереднє фото">‹</button><button class="gl-a gl-n" aria-label="Наступне фото">›</button><span class="gl-c"></span><div class="gl-cap"><small></small><b></b><span></span></div></div><div class="gl-r"></div></div>';
    var chips = $('.gl-chips', host), st = $('.gl-st img', host), rail = $('.gl-r', host), cnt = $('.gl-c', host), cap = $('.gl-cap', host), list = all, i = 0;
    WORK_CATS.forEach(function (c) {
      var n = c.id === 'all' ? all.length : all.filter(function (x) { return x.w.tags.indexOf(c.id) > -1; }).length;
      var b = document.createElement('button'); b.className = 'gl-chip'; b.dataset.id = c.id; b.setAttribute('role', 'tab'); b.innerHTML = esc(c.name) + ' <sup>' + n + '</sup>'; b.onclick = function () { filt(c.id); }; chips.appendChild(b);
    });
    function filt(id) {
      $$('.gl-chip', chips).forEach(function (b) { b.classList.toggle('act', b.dataset.id === id); b.setAttribute('aria-selected', b.dataset.id === id); });
      list = id === 'all' ? all : all.filter(function (x) { return x.w.tags.indexOf(id) > -1; });
      rail.innerHTML = list.map(function (x, k) { return '<button aria-label="Фото ' + (k + 1) + '"><img src="' + T(x.p) + '" alt="" loading="lazy"></button>'; }).join('');
      $$('button', rail).forEach(function (b, k) { b.onclick = function () { go(k); }; });
      go(0);
    }
    function go(n) {
      i = (n + list.length) % list.length; var x = list[i];
      st.classList.add('sw'); setTimeout(function () { st.src = W(x.p); st.alt = x.w.title; st.onload = function () { st.classList.remove('sw'); }; }, 180);
      cnt.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + list.length).slice(-2);
      $('small', cap).textContent = WORK_CATS.filter(function (c) { return c.id === x.w.tags[0]; })[0].name; $('b', cap).textContent = x.w.title; $('span', cap).textContent = x.w.note;
      $$('button', rail).forEach(function (b, k) { b.classList.toggle('on', k === i); });
      var on = $$('button', rail)[i]; if (on) { var r = rail.getBoundingClientRect(), o = on.getBoundingClientRect(); if (rail.scrollHeight > rail.clientHeight + 4) rail.scrollTop += o.top - r.top - r.height / 2 + o.height / 2; else rail.scrollLeft += o.left - r.left - r.width / 2 + o.width / 2; }
    }
    $('.gl-p', host).onclick = function () { go(i - 1); }; $('.gl-n', host).onclick = function () { go(i + 1); };
    var sx = 0, stage = $('.gl-st', host);
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); });
    stage.addEventListener('click', function (e) { if (e.target.closest('button') || !window.DTS) return; DTS.openLb(list[i].w, list[i].w.photos.indexOf(list[i].p)); });
    filt('all');
  }

  /* ---------- старт ---------- */
  function heroes() {
    var h = $('[data-hero]'); if (!h) return;
    ({ storm: heroStorm, craft: heroCraft, split: heroSplit })[h.dataset.hero](h);
  }
  function init() { heroes(); reveal(); scrollFx(); gallery(); preloader(function () {}); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
