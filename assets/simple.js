/* ROOF & VOLT — простий варіант. Без анімацій і без прихованого контенту. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var BASE = '../assets/';
  var LEAD_URL = 'https://script.google.com/macros/s/AKfycbzUFDAAJ34kTLE0-nbPfC_qXGDNJtcXMXjVNK6B__tzRc4TbLrnKoo5sjVhJrDkg6yt/exec';

  /* ---------- меню на телефоні ---------- */
  var mb = $('.menu-btn'), menu = $('#menu');
  if (mb) {
    mb.addEventListener('click', function () { var o = menu.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Закрити' : 'Меню'; });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Меню'; }); });
  }

  /* ---------- «Замір» у блоці напряму підставляє напрям ---------- */
  var sel = $('#f-dir');
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-pick]');
    if (a && sel) { sel.value = a.dataset.pick; sel.removeAttribute('aria-invalid'); $('#f-dir-e').textContent = ''; setTimeout(function () { $('#f-phone').focus({ preventScroll: true }); }, 0); }
  });

  /* ---------- вікно ---------- */
  var dlg = $('#dlg'), dlgT = $('#dlg-t'), dlgB = $('.dlg-b', dlg), last = null;
  function openDlg(title, html) {
    last = document.activeElement; dlgT.textContent = title; dlgB.innerHTML = html;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
  }
  $('.dlg-x', dlg).addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { dlgB.innerHTML = ''; if (last) last.focus(); });

  /* ---------- вкладки ---------- */
  function tabs(host, items, onSet) {
    var t = document.createElement('div'); t.className = 'tabs'; t.setAttribute('role', 'tablist');
    items.forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.dataset.id = it.id;
      b.innerHTML = esc(it.name) + (it.n ? '<small>' + it.n + '</small>' : '');
      b.addEventListener('click', function () { set(it.id); }); t.appendChild(b);
    });
    function set(id) { $$('.tab', t).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.id === id); }); onSet(id); }
    host.appendChild(t); return set;
  }

  /* ---------- наші об'єкти ---------- */
  var gal = $('[data-gal]');
  if (gal && window.GALLERY) {
    var LIM = matchMedia('(max-width:767px)').matches ? 8 : 12;
    var box = document.createElement('div');
    var setG = tabs(gal, GALLERY.map(function (g) { return { id: g.id, name: g.name, n: g.photos.length }; }), function (id) { render(id, false); });
    gal.appendChild(box);
    function render(id, all) {
      var g = GALLERY.filter(function (x) { return x.id === id; })[0], list = all ? g.photos : g.photos.slice(0, LIM);
      box.innerHTML = '<div class="gal-g">' + list.map(function (k, i) {
        return '<button type="button" data-i="' + i + '" aria-label="' + esc(g.name) + ': фото ' + (i + 1) + ' з ' + g.photos.length + '"><img src="' + BASE + 't/' + k + '.webp" alt="' + esc(g.name) + ', фото ' + (i + 1) + '" width="360" height="270" loading="lazy"></button>';
      }).join('') + '</div>' + (!all && g.photos.length > LIM ? '<button type="button" class="btn more">Показати всі ' + g.photos.length + ' фото</button>' : '');
      $$('.gal-g button', box).forEach(function (b) { b.addEventListener('click', function () { photo(g, +b.dataset.i); }); });
      var m = $('.more', box); if (m) m.addEventListener('click', function () { render(id, true); var f = $('.gal-g button:nth-child(' + (LIM + 1) + ')', box); if (f) f.focus(); });
    }
    function photo(g, i) {
      var n = g.photos.length;
      function html(k) {
        return '<div class="ph-v"><img src="' + BASE + 'w/' + g.photos[k] + '.webp" alt="' + esc(g.name) + ', фото ' + (k + 1) + '"></div><div class="ph-n"><button type="button" class="btn btn-s" data-d="-1">← Попереднє</button><span>' + (k + 1) + ' з ' + n + '</span><button type="button" class="btn btn-s" data-d="1">Наступне →</button></div>';
      }
      openDlg(g.name, html(i));
      function nav(d) { i = (i + d + n) % n; dlgB.innerHTML = html(i); bind(); }
      function bind() { $$('[data-d]', dlgB).forEach(function (b) { b.addEventListener('click', function () { nav(+b.dataset.d); }); }); }
      bind();
      dlg.onkeydown = function (e) { if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'ArrowRight') nav(1); };
    }
    setG(GALLERY[0].id);
  }

  /* ---------- каталог і RAL ---------- */
  var cat = $('[data-cat]');
  var setC = null;
  if (cat && window.CATALOG) {
    var G = [
      { id: 'roof', name: 'Покрівля', cats: ['roof', 'prof', 'drain', 'parts'] },
      { id: 'facade', name: 'Фасади', cats: ['facade'] },
      { id: 'fence', name: 'Паркани та навіси', cats: ['fence', 'prof'] },
      { id: 'el', name: 'Електрика', cats: [] }
    ];
    var EL = ['Електрифікація будинку під ключ', 'Монтаж проводки', 'Щитки та автоматика', 'Розетки, вимикачі й освітлення'];
    var catName = function (id) { var c = CATS.filter(function (x) { return x.id === id; })[0]; return c ? c.name : ''; };
    var cbox = document.createElement('div');
    setC = tabs(cat, G.map(function (g) { return { id: g.id, name: g.name }; }), function (id) {
      var g = G.filter(function (x) { return x.id === id; })[0];
      if (!g.cats.length) {
        cbox.innerHTML = '<div class="el-box"><h3 class="cat-h">Електромонтаж під ключ</h3><p>Матеріали для електрики підбираємо під ваш будинок, тому окремого каталогу немає. Ось що ми робимо:</p><ul>' + EL.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><a class="btn btn-a" href="#zamir" data-pick="Електрика">Викликати замірника</a></div>';
        return;
      }
      cbox.innerHTML = g.cats.map(function (c) {
        var ps = CATALOG.filter(function (p) { return p.cat === c; });
        if (!ps.length) return '';
        return '<h3 class="cat-h">' + esc(catName(c)) + '</h3><div class="prods">' + ps.map(function (p) {
          var s = p.specs.slice(0, 2).map(function (x) { return x[0] + ': ' + x[1]; }).join(' · ') || (p.items.length ? p.items.length + ' елементів' : '');
          return '<button type="button" class="prod" data-id="' + p.id + '"><img src="' + BASE + 'p/' + p.id + '.webp" alt="" width="96" height="72" loading="lazy"><span><b>' + esc(p.name) + '</b><span>' + esc(s) + '</span></span></button>';
        }).join('') + '</div>';
      }).join('');
      $$('.prod', cbox).forEach(function (b) { b.addEventListener('click', function () { prod(CATALOG.filter(function (p) { return p.id === b.dataset.id; })[0]); }); });
    });
    cat.appendChild(cbox);
    setC('roof');
    function prod(p) {
      var h = '<img class="d-img" src="' + BASE + 'p/' + p.id + '.webp" alt="' + esc(p.name) + '">';
      h += '<div class="d-desc">' + p.desc.map(function (d) { return '<p>' + esc(d) + '</p>'; }).join('') + '</div>';
      if (p.specs.length) h += '<h3>Характеристики</h3><div class="tbl">' + p.specs.map(function (s) { return '<span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b>'; }).join('') + '</div>';
      var SC = window.SCHEME && SCHEME[p.id];
      if (SC) h += '<h3>' + esc(SC.t) + '</h3><div class="sch">' + SC.s.map(function (x) { return '<figure><img src="' + BASE + x[0] + '" alt="' + esc(p.name + (x[1] ? ' — ' + x[1] : '') + ': ' + SC.t) + '" loading="lazy">' + (x[1] ? '<figcaption>' + esc(x[1]) + '</figcaption>' : '') + '</figure>'; }).join('') + '</div>';
      var gr = Object.keys(p.colors);
      if (gr.length) h += '<h3>Кольори RAL</h3>' + gr.map(function (g) { return '<p class="grp">' + esc(g) + '</p><div class="ral">' + p.colors[g].map(function (c) { return '<button type="button" style="background:' + swatch(c) + '" aria-pressed="false" data-n="' + esc(g + ' · ' + c) + '" aria-label="' + esc(g + ': ' + c) + '"></button>'; }).join('') + '</div>'; }).join('') + '<p class="ral-n" aria-live="polite">Натисніть на колір, щоб побачити назву</p>';
      if (p.items.length) {
        var IM = (window.ITEM_IMG && ITEM_IMG[p.id]) || {};
        h += '<h3>Елементи</h3><div class="elg">' + p.items.map(function (a) {
          var s = IM[a];
          return '<figure>' + (s ? '<span class="ei"><img src="' + BASE + s + '" alt="' + esc(a) + '" loading="lazy"></span>' : '<span class="ei ei-n"></span>') + '<figcaption>' + esc(a) + '</figcaption></figure>';
        }).join('') + '</div>';
      }
      if (p.adv.length) h += '<h3>Переваги</h3><ul class="adv">' + p.adv.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>';
      h += '<p style="margin-top:18px"><a class="btn btn-a" href="#zamir" data-pick="' + (p.cat === 'facade' ? 'Фасади' : p.cat === 'fence' ? 'Паркани та навіси' : 'Покрівля') + '" data-close>Викликати замірника</a></p>';
      openDlg(p.name, h);
      $$('.ral button', dlgB).forEach(function (b) { b.addEventListener('click', function () { $$('.ral button', dlgB).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); $('.ral-n', dlgB).textContent = b.dataset.n; }); });
      var cl = $('[data-close]', dlgB); if (cl) cl.addEventListener('click', function () { dlg.close(); });
      dlg.onkeydown = null;
    }
  }
  /* «Матеріали» в блоці напряму відкриває потрібну вкладку каталогу */
  $$('[data-dir]').forEach(function (a) {
    a.addEventListener('click', function () { if (setC && a.dataset.dir !== 'el') setC(a.dataset.dir); });
  });

  /* ---------- форма заміру ---------- */
  var form = $('#zamir');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ph = $('#f-phone'), nm = $('#f-name'), ok = true, digits = ph.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 12) { ph.setAttribute('aria-invalid', 'true'); $('#f-phone-e').textContent = 'Вкажіть номер телефону повністю, наприклад 093 000 00 00.'; ok = false; }
      else { ph.removeAttribute('aria-invalid'); $('#f-phone-e').textContent = ''; }
      if (!sel.value) { sel.setAttribute('aria-invalid', 'true'); $('#f-dir-e').textContent = 'Оберіть напрям робіт.'; ok = false; }
      else { sel.removeAttribute('aria-invalid'); $('#f-dir-e').textContent = ''; }
      if (!ok) { (ph.getAttribute('aria-invalid') ? ph : sel).focus(); return; }
      var text = ['🔔 Заявка на замір з сайту ROOF & VOLT (простий варіант)', '', 'Напрям: ' + sel.value, "Ім'я: " + (nm.value.trim() || '—'), 'Телефон: ' + ph.value.trim()].join('\n');
      var btn = $('button[type=submit]', form); btn.disabled = true;
      fetch(LEAD_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ phone: ph.value.trim(), text: text }) })
        .then(function () { $('.ok', form).textContent = 'Дякуємо! Заявку прийнято — ми зателефонуємо найближчим часом.'; form.reset(); })
        .catch(function () { $('.ok', form).textContent = 'Не вдалося надіслати. Будь ласка, зателефонуйте: 093 59 51 954.'; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
