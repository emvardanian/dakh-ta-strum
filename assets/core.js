/* Дах та струм — спільний рушій сайту: рілс у шапці, роботи, каталог, квіз, анімації.
   Теми задаються CSS-змінними у кожному варіанті:
   --acc --acc-ink --bg --fg --mut --line --card --card-fg --lb-bg --radius --font-h */
(function () {
  'use strict';
  var PHONE = '+380935951954', PHONE_TXT = '093 59 51 954';
  /* Підключіть сюди обробник заявок (Telegram-бот / CRM / Google Apps Script). Порожньо — заявка лише показується. */
  var FORM_ENDPOINT = '';
  var BASE = (document.currentScript && document.currentScript.src.replace(/core\.js.*$/, '')) || 'assets/';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var W = function (id) { return BASE + 'w/' + id + '.webp'; };
  var T = function (id) { return BASE + 't/' + id + '.webp'; };

  /* ---------- базові стилі компонентів ---------- */
  var css = '' +
  '.reel{position:absolute;inset:0;overflow:hidden;background:#0b0d10;z-index:0}' +
  '.reel-s{position:absolute;inset:0;opacity:0;transition:opacity 1.5s ease,filter 1.5s ease;filter:blur(6px)}' +
  '.reel-s.on{opacity:1;filter:none}' +
  '.reel-s img{position:absolute;inset:-2%;width:104%;height:104%;object-fit:cover;will-change:transform}' +
  '.reel-s.on img{animation-duration:var(--reel-dur,7s);animation-timing-function:linear;animation-fill-mode:both}' +
  '.m-push img{animation-name:rPush}.m-pull img{animation-name:rPull}.m-glide-l img{animation-name:rGl}.m-glide-r img{animation-name:rGr}.m-rise img{animation-name:rRise}' +
  '@keyframes rPush{from{transform:scale(1.04)}to{transform:scale(1.2) translate(1%,-1%)}}' +
  '@keyframes rPull{from{transform:scale(1.24) translate(-1%,1%)}to{transform:scale(1.04)}}' +
  '@keyframes rGl{from{transform:scale(1.18) translateX(4%)}to{transform:scale(1.18) translateX(-4%)}}' +
  '@keyframes rGr{from{transform:scale(1.18) translateX(-4%)}to{transform:scale(1.18) translateX(4%)}}' +
  '@keyframes rRise{from{transform:scale(1.16) translateY(4%)}to{transform:scale(1.16) translateY(-4%)}}' +
  '.reel-out{position:absolute;inset:0;display:grid;place-items:center;background:rgba(8,10,14,.62);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity 1s ease;z-index:2;pointer-events:none}' +
  '.reel-out.on{opacity:1}.reel-out .lg{transform:scale(.9);opacity:0;transition:transform 1.6s cubic-bezier(.2,.8,.2,1),opacity 1s ease .2s;text-align:center;color:#fff}' +
  '.reel-out.on .lg{transform:none;opacity:1}.reel-out svg{width:120px;height:90px}.reel-out b{display:block;font:700 clamp(28px,4vw,46px)/1 var(--font-h,inherit);letter-spacing:.04em;margin-top:14px}.reel-out small{display:block;margin-top:10px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;opacity:.8}' +
  '.reel-bars{display:flex;gap:6px}.reel-bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.28);overflow:hidden;position:relative;min-width:18px}' +
  '.reel-bars i b{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}.reel-bars i.done b{transform:none}.reel-bars i.run b{animation:rBar var(--reel-dur,7s) linear forwards}' +
  '@keyframes rBar{to{transform:none}}' +
  '.reel-cap{transition:opacity .5s ease,transform .5s ease}.reel-cap.sw{opacity:0;transform:translateY(8px)}' +

  /* hero video */
  '.hv-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.14);transition:transform 2.6s cubic-bezier(.2,.8,.2,1)}.hv.open .hv-v{transform:none}' +
  '.hv-cur{position:absolute;inset:0;z-index:6;pointer-events:none}' +
  '.hv-cur::before,.hv-cur::after{content:"";position:absolute;left:0;right:0;height:50.5%;background:#07090c;transition:transform 1.5s cubic-bezier(.77,0,.18,1)}' +
  '.hv-cur::before{top:0}.hv-cur::after{bottom:0}.hv.open .hv-cur::before{transform:translateY(-101%)}.hv.open .hv-cur::after{transform:translateY(101%)}' +
  '.hv-cur .lg{position:absolute;inset:0;display:grid;place-items:center;z-index:2;color:#fff;text-align:center;transition:opacity .5s,transform 1s}' +
  '.hv.open .hv-cur .lg{opacity:0;transform:scale(1.15)}' +
  '.hv-cur svg{width:110px;height:84px}.hv-cur .hs{fill:none;stroke:#fff;stroke-width:1.6;stroke-dasharray:230;stroke-dashoffset:230;animation:hvDraw 1s .1s cubic-bezier(.6,0,.2,1) forwards}' +
  '.hv-cur .bs{fill:none;stroke:#ff6a13;stroke-width:2;stroke-dasharray:150;stroke-dashoffset:150;animation:hvDraw .7s .7s cubic-bezier(.6,0,.2,1) forwards}' +
  '.hv-cur b{display:block;margin-top:14px;font:700 15px/1 var(--font-h,inherit);letter-spacing:.42em;opacity:0;animation:hvFade .6s .9s forwards}' +
  '@keyframes hvDraw{to{stroke-dashoffset:0}}@keyframes hvFade{to{opacity:1;letter-spacing:.3em}}' +
  '.hv-ko{position:absolute;inset:0;width:100%;height:100%;z-index:6;overflow:visible;pointer-events:none;transform-origin:50% 62%;transition:transform 2s cubic-bezier(.7,0,.84,0),opacity 1s ease 1.1s}' +
  '.hv.open .hv-ko{transform:scale(30);opacity:0}' +
  '.hv-ko text{font-family:var(--font-h,sans-serif);font-weight:700;letter-spacing:-4px}' +
  'html:not(.hv-ready) .hero .ln>span,html:not(.hv-ready) .hero .fd,html:not(.hv-ready) .hero .w,html:not(.hv-ready) .hero p,html:not(.hv-ready) .hero .acts{animation-play-state:paused!important}' +
  '.reel-bars i b{transition:none}[data-reel-bars],.hbot{transition:opacity .8s}html:not(.hv-ready) [data-reel-bars],html:not(.hv-ready) .hbot{opacity:0}' +
  /* reveal */
  '.rv{opacity:0;transform:translateY(36px);transition:opacity .9s cubic-bezier(.2,.7,.1,1),transform .9s cubic-bezier(.2,.7,.1,1)}.rv.on{opacity:1;transform:none}' +
  '.rv.d1{transition-delay:.08s}.rv.d2{transition-delay:.16s}.rv.d3{transition-delay:.24s}.rv.d4{transition-delay:.32s}' +
  /* works */
  '.wk-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}' +
  '.wk-chip{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .3s,color .3s,border-color .3s}' +
  '.wk-chip:hover{border-color:var(--acc)}.wk-chip.act{background:var(--acc);border-color:var(--acc);color:var(--acc-ink,#fff)}.wk-chip sup{opacity:.7;margin-left:3px;font-size:11px}' +
  '.wk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:16px}' +
  '.wk-card{position:relative;display:block;width:100%;padding:0;border:0;border-radius:var(--radius,16px);overflow:hidden;cursor:zoom-in;background:#222;aspect-ratio:4/3;text-align:left;color:#fff;font:inherit;animation:wkIn .6s cubic-bezier(.2,.7,.1,1) both}' +
  '.wk-card.big{grid-column:span 2;aspect-ratio:auto}' +
  '@media(max-width:700px){.wk-card.big{grid-column:auto;aspect-ratio:4/3}}' +
  '@keyframes wkIn{from{opacity:0;transform:translateY(18px) scale(.98)}}' +
  '.wk-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.2,.7,.1,1)}' +
  '.wk-card:hover img{transform:scale(1.06)}' +
  '.wk-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.72))}' +
  '.wk-m{position:absolute;left:18px;right:18px;bottom:16px;z-index:1}.wk-m small{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--acc-soft,#ffb27a)}' +
  '.wk-m h3{margin:4px 0 0;font:600 19px/1.2 var(--font-h,inherit);color:#fff}.wk-m span{font-size:13px;opacity:.85}' +
  '.wk-n{position:absolute;top:14px;right:14px;z-index:1;font-size:12px;font-weight:700;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)}' +
  /* lightbox */
  '.lbx{position:fixed;inset:0;z-index:200;background:var(--lb-bg,rgba(8,9,12,.96));display:grid;grid-template-columns:1fr 230px;grid-template-rows:auto 1fr;gap:14px;padding:18px;opacity:0;pointer-events:none;transition:opacity .35s;color:#fff}' +
  '.lbx.open{opacity:1;pointer-events:auto}.lbx-h{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:14px}' +
  '.lbx-h h3{margin:0;font:600 18px/1.25 var(--font-h,inherit)}.lbx-h p{margin:3px 0 0;font-size:13px;opacity:.7}' +
  '.lbx-x,.lbx-a{width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;font-size:22px;cursor:pointer;flex:none;transition:background .25s}.lbx-x:hover,.lbx-a:hover{background:var(--acc)}' +
  '.lbx-m{position:relative;border-radius:14px;overflow:hidden;background:#000;min-height:0}.lbx-m img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .35s}' +
  '.lbx-a{position:absolute;top:50%;margin-top:-24px;z-index:2}.lbx-p{left:14px}.lbx-n{right:14px}' +
  '.lbx-c{position:absolute;left:16px;bottom:14px;font-size:13px;font-weight:600;letter-spacing:.08em;background:rgba(0,0,0,.5);padding:5px 10px;border-radius:999px}' +
  '.lbx-r{overflow:auto;display:grid;gap:8px;align-content:start;min-height:0}.lbx-r button{border:2px solid transparent;border-radius:10px;overflow:hidden;padding:0;aspect-ratio:4/3;cursor:pointer;opacity:.55;transition:opacity .25s,border-color .25s;background:#111}' +
  '.lbx-r button.on{opacity:1;border-color:var(--acc)}.lbx-r img{width:100%;height:100%;object-fit:cover;display:block}' +
  '.lbx-cta{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;background:var(--acc);color:var(--acc-ink,#fff);font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap}' +
  '@media(max-width:800px){.lbx{grid-template-columns:1fr;grid-template-rows:auto 1fr 74px;padding:12px}.lbx-r{display:flex;overflow-x:auto}.lbx-r button{flex:none;width:96px}.lbx-h .lbx-cta{display:none}}' +
  /* catalog */
  '.ct-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:26px;padding-bottom:2px}.ct-tabs::-webkit-scrollbar{display:none}' +
  '.ct-tab{flex:none;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s}' +
  '.ct-tab.act{background:var(--fg);color:var(--bg);border-color:var(--fg)}' +
  '.ct-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:16px}' +
  '.ct-card{display:flex;flex-direction:column;text-align:left;padding:0;border:1px solid var(--line);border-radius:var(--radius,16px);overflow:hidden;background:var(--card);color:var(--card-fg,inherit);font:inherit;cursor:pointer;transition:transform .45s cubic-bezier(.2,.7,.1,1),box-shadow .45s,border-color .3s;animation:wkIn .55s cubic-bezier(.2,.7,.1,1) both}' +
  '.ct-card:hover{transform:translateY(-5px);box-shadow:0 24px 40px -24px rgba(0,0,0,.45);border-color:var(--acc)}' +
  '.ct-im{aspect-ratio:4/3;background:#fff;overflow:hidden}.ct-im img{width:100%;height:100%;object-fit:cover;transition:transform .8s}.ct-card:hover .ct-im img{transform:scale(1.06)}' +
  '.ct-tx{padding:16px 18px 18px}.ct-tx h3{margin:0;font:600 18px/1.2 var(--font-h,inherit)}.ct-sw{display:flex;gap:5px;margin-top:10px}.ct-sw i{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}' +
  '.ct-tx p{margin:8px 0 0;font-size:13px;color:var(--mut)}' +
  '.ctd-bg{position:fixed;inset:0;z-index:190;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .4s}.ctd-bg.open{opacity:1;pointer-events:auto}' +
  '.ctd{position:fixed;top:0;right:0;bottom:0;z-index:191;width:min(620px,100vw);background:var(--card);color:var(--card-fg,inherit);overflow:auto;transform:translateX(102%);transition:transform .6s cubic-bezier(.2,.8,.2,1);box-shadow:-30px 0 60px -30px rgba(0,0,0,.5)}.ctd.open{transform:none}' +
  '.ctd-x{position:sticky;top:14px;float:right;margin:14px 14px 0 0;width:46px;height:46px;border-radius:50%;border:0;background:rgba(127,127,127,.18);color:inherit;font-size:22px;cursor:pointer;z-index:2}' +
  '.ctd-pic{height:300px;background:#fff;overflow:hidden;position:relative}.ctd-pic img{width:100%;height:100%;object-fit:cover}.ctd-tint{position:absolute;inset:0;mix-blend-mode:color;opacity:0;transition:opacity .4s,background .4s}' +
  '.ctd-b{padding:24px 30px 40px}.ctd-b small{color:var(--acc);font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase}.ctd-b h3{margin:6px 0 0;font:600 30px/1.1 var(--font-h,inherit)}' +
  '.ctd-b p{line-height:1.6;color:var(--mut);font-size:15px;margin:12px 0 0}.ctd-b h4{margin:28px 0 12px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}' +
  '.ctd-t div{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--line);font-size:15px}.ctd-t span{color:var(--mut)}' +
  '.ctd-l{list-style:none;margin:0;padding:0;display:grid;gap:8px}.ctd-l li{position:relative;padding-left:22px;font-size:15px;line-height:1.5}.ctd-l li::before{content:"";position:absolute;left:2px;top:9px;width:8px;height:8px;border-radius:50%;background:var(--acc)}' +
  '.ctd-ch{display:flex;flex-wrap:wrap;gap:8px}.ctd-ch span{border:1px solid var(--line);border-radius:999px;padding:7px 12px;font-size:14px}' +
  '.ctd-g{font-size:13px;color:var(--mut);margin:12px 0 8px}.ctd-sw{display:flex;flex-wrap:wrap;gap:8px}.ctd-sw button{width:34px;height:34px;border-radius:50%;border:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);outline:2px solid transparent;outline-offset:2px;cursor:pointer;transition:transform .25s}' +
  '.ctd-sw button:hover{transform:scale(1.12)}.ctd-sw button.sel{outline-color:var(--acc)}.ctd-cn{margin-top:12px;font-weight:600;min-height:22px}' +
  '.ctd-go{display:flex;align-items:center;justify-content:center;min-height:52px;margin-top:28px;border-radius:999px;background:var(--acc);color:var(--acc-ink,#fff);font-weight:700;text-decoration:none}' +
  /* quiz */
  '.qz{position:relative}.qz-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;font-size:14px;color:var(--q-mut,var(--mut))}' +
  '.qz-bar{height:4px;border-radius:2px;background:var(--q-line,var(--line));overflow:hidden;margin-bottom:26px}.qz-bar i{display:block;height:100%;width:0;background:var(--acc);transition:width .6s cubic-bezier(.2,.7,.1,1)}' +
  '.qz-st{display:none;animation:qzIn .5s cubic-bezier(.2,.7,.1,1)}.qz-st.on{display:block}@keyframes qzIn{from{opacity:0;transform:translateX(24px)}}' +
  '.qz h3{margin:0 0 18px;font:600 clamp(22px,2.6vw,30px)/1.15 var(--font-h,inherit)}' +
  '.qz-o{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:10px}' +
  '.qz-o button{min-height:64px;padding:14px 18px;border-radius:14px;border:1px solid var(--q-line,var(--line));background:var(--q-opt,transparent);color:inherit;font:inherit;font-size:15px;font-weight:600;text-align:left;cursor:pointer;transition:border-color .25s,background .25s,transform .25s}' +
  '.qz-o button:hover{border-color:var(--acc);transform:translateY(-2px)}.qz-o button.sel{border-color:var(--acc);background:var(--acc);color:var(--acc-ink,#fff)}' +
  '.qz-f{display:grid;grid-template-columns:1fr 1fr;gap:10px}.qz-f label{display:grid;gap:6px;font-size:13px;color:var(--q-mut,var(--mut))}' +
  '.qz-f input,.qz-f select{min-height:52px;border-radius:12px;border:1px solid var(--q-line,var(--line));background:var(--q-in,transparent);color:inherit;padding:0 14px;font:inherit;font-size:16px;outline:none;transition:border-color .25s}' +
  '.qz-f input:focus,.qz-f select:focus{border-color:var(--acc)}.qz-f select option{color:#111}.qz-f .w{grid-column:1/-1}' +
  '.qz-nav{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}.qz-b{min-height:52px;padding:0 26px;border-radius:999px;border:1px solid var(--q-line,var(--line));background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer}' +
  '.qz-go{background:var(--acc);border-color:var(--acc);color:var(--acc-ink,#fff)}.qz-err{color:#ff7a6b;font-size:14px;margin-top:10px;min-height:20px}' +
  '.qz-ok{text-align:center;padding:20px 0}.qz-ok .ic{width:68px;height:68px;border-radius:50%;background:var(--acc);display:grid;place-items:center;margin:0 auto 18px;animation:pop .6s cubic-bezier(.2,.9,.3,1.4)}' +
  '@keyframes pop{from{transform:scale(0)}}.qz-ok .ic svg{width:32px;height:32px;stroke:var(--acc-ink,#fff);fill:none;stroke-width:3}' +
  '@media(max-width:560px){.qz-f{grid-template-columns:1fr}}' +
  /* misc */
  '.prog{position:fixed;left:0;top:0;height:3px;width:100%;background:var(--acc);transform:scaleX(0);transform-origin:left;z-index:300}' +
  '.mbar{position:fixed;left:10px;right:10px;bottom:10px;z-index:120;display:none;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:6px;border-radius:18px;background:rgba(14,16,20,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 14px 34px -12px rgba(0,0,0,.6)}' +
  '.mbar a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:54px;border-radius:13px;color:#fff;font-size:12px;font-weight:700;text-decoration:none}.mbar a.p{background:var(--acc);color:var(--acc-ink,#fff)}.mbar svg{width:20px;height:20px}' +
  '@media(max-width:820px){.mbar{display:grid}body{padding-bottom:84px}}' +
  '@media(prefers-reduced-motion:reduce){.reel-s.on img,.reel-bars i.run b{animation:none!important}.rv{opacity:1;transform:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.insertBefore(st, document.head.firstChild);

  var LOGO = '<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M4 46V24L27 5l10 8V7h6v11l4 3.3V46z" fill="#fff"/><path d="M53 3 44 24h7l-5 21 15-27h-8l6-15z" fill="#ff6a13"/></svg>';

  /* ---------- REEL ---------- */
  function initReel() {
    var host = $('[data-reel]'); if (!host || !window.REEL) return;
    var dur = +(host.dataset.dur || 6500), list = REEL, i = -1, timer;
    host.style.setProperty('--reel-dur', (dur + 1500) / 1000 + 's');
    var slides = list.map(function (s) {
      var d = document.createElement('div'); d.className = 'reel-s m-' + s.m;
      d.innerHTML = '<img src="' + W(s.p) + '" alt="' + esc(s.cap) + '"' + (list.indexOf(s) ? ' loading="lazy"' : '') + '>';
      host.appendChild(d); return d;
    });
    var out = null;
    if (host.hasAttribute('data-outro')) {
      out = document.createElement('div'); out.className = 'reel-out';
      out.innerHTML = '<div class="lg">' + LOGO + '<b>ДАХ ТА СТРУМ</b><small>Покрівля · Фасади · Електрика</small></div>';
      host.appendChild(out);
    }
    var bars = $('[data-reel-bars]'), cap = $('[data-reel-cap]'), num = $('[data-reel-num]');
    if (bars) bars.innerHTML = list.map(function () { return '<i><b></b></i>'; }).join('');
    var bi = bars ? $$('i', bars) : [];
    function show(n) {
      if (out && n === list.length) { // фінальна заставка з логотипом, як у рілсі
        out.classList.add('on'); timer = setTimeout(function () { out.classList.remove('on'); bi.forEach(function (b) { b.className = ''; }); show(0); }, 3000); return;
      }
      i = n % list.length;
      slides.forEach(function (s, k) { if (k === i) { s.classList.remove('on'); void s.offsetWidth; s.classList.add('on'); } else s.classList.remove('on'); });
      bi.forEach(function (b, k) { b.className = k < i ? 'done' : ''; }); if (bi[i]) { void bi[i].offsetWidth; bi[i].className = 'run'; }
      if (cap) { cap.classList.add('sw'); setTimeout(function () { cap.textContent = list[i].cap; cap.classList.remove('sw'); }, 300); }
      if (num) num.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + list.length).slice(-2);
      var nx = slides[(i + 1) % list.length].querySelector('img'); if (nx.loading === 'lazy') nx.loading = 'eager';
      timer = setTimeout(function () { show(out && i === list.length - 1 ? list.length : i + 1); }, dur);
    }
    if (reduce) { slides[0].classList.add('on'); if (cap) cap.textContent = list[0].cap; return; }
    show(0);
    document.addEventListener('visibilitychange', function () { clearTimeout(timer); if (!document.hidden) show(i + 1 > list.length - 1 ? 0 : i + 1); });
    $$('[data-reel-open]').forEach(function (b) { b.addEventListener('click', function () { var w = WORKS.filter(function (o) { return o.photos.indexOf(list[i].p) > -1; })[0]; if (w) openLb(w, w.photos.indexOf(list[i].p)); }); });
  }


  /* ---------- HERO VIDEO (кіно-рілс з реальних фото) ---------- */
  function initHeroVideo() {
    var host = $('[data-hero-video]'); if (!host || !window.REEL) return false;
    host.classList.add('hv');
    var mob = matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
    var name = mob ? 'hero-m' : 'hero';
    var mode = host.dataset.intro || 'curtain';
    var h = '<video class="hv-v" muted playsinline loop preload="auto" poster="' + BASE + 'video/' + name + '-poster.jpg"><source src="' + BASE + 'video/' + name + '.mp4" type="video/mp4"></video>' +
      '<div class="reel-out"><div class="lg">' + LOGO + '<b>ДАХ ТА СТРУМ</b><small>Покрівля · Фасади · Електрика</small></div></div>';
    if (mode === 'curtain') h += '<div class="hv-cur"><div class="lg"><div><svg viewBox="0 0 64 48" aria-hidden="true"><path class="hs" d="M4 46V24L27 5l10 8V7h6v11l4 3.3V46z"/><path class="bs" d="M53 3 44 24h7l-5 21 15-27h-8l6-15z"/></svg><b>ДАХ ТА СТРУМ</b></div></div></div>';
    if (mode === 'knockout') {
      var bg = host.dataset.koBg || '#0e1116', fs = mob ? 230 : 250;
      h += '<svg class="hv-ko" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><mask id="hvko" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="40000" height="40000"><rect x="-20000" y="-20000" width="40000" height="40000" fill="#fff"/>' +
        '<text x="800" y="' + (mob ? 420 : 455) + '" text-anchor="middle" font-size="' + fs + '" fill="#000">ДАХ ТА</text><text x="800" y="' + (mob ? 650 : 700) + '" text-anchor="middle" font-size="' + fs + '" fill="#000">СТРУМ</text></mask></defs>' +
        '<rect x="-20000" y="-20000" width="40000" height="40000" fill="' + bg + '" mask="url(#hvko)"/></svg>';
    }
    host.innerHTML = h;
    var v = $('video', host), out = $('.reel-out', host), END = window.REEL_END || 24, list = REEL;
    var bars = $('[data-reel-bars]'), cap = $('[data-reel-cap]'), num = $('[data-reel-num]'), cur = -1;
    if (bars) {
      bars.innerHTML = list.map(function (s, k) { var d = (k + 1 < list.length ? list[k + 1].t : END) - s.t; return '<i style="flex:' + d.toFixed(2) + '"><b></b></i>'; }).join('');
    }
    var bi = bars ? $$('b', bars) : [];
    function tick() {
      var t = v.currentTime || 0, k = 0;
      for (var j = 0; j < list.length; j++) if (t >= list[j].t) k = j;
      if (k !== cur) {
        cur = k;
        if (cap) { cap.classList.add('sw'); setTimeout(function () { cap.textContent = list[cur].cap; cap.classList.remove('sw'); }, 250); }
        if (num) num.textContent = ('0' + (k + 1)).slice(-2) + ' / ' + ('0' + list.length).slice(-2);
      }
      bi.forEach(function (b, j) {
        var st = list[j].t, en = j + 1 < list.length ? list[j + 1].t : END;
        b.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (t - st) / (en - st))) + ')';
      });
      out.classList.toggle('on', t >= END - 0.1);
      requestAnimationFrame(tick);
    }
    function ready() { document.documentElement.classList.add('hv-ready'); }
    if (reduce) { host.classList.add('open'); ready(); v.removeAttribute('loop'); return true; }
    var started = false;
    function start() {
      if (started) return; started = true;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      setTimeout(function () { host.classList.add('open'); }, mode === 'knockout' ? 1500 : 1300);
      setTimeout(ready, mode === 'knockout' ? 2300 : 1900);
    }
    if (v.readyState >= 2) start(); else { v.addEventListener('loadeddata', start); setTimeout(start, 2500); }
    if (mode === 'knockout') { var p0 = v.play(); if (p0 && p0.catch) p0.catch(function () {}); }
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); else { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
    $$('[data-reel-open]').forEach(function (b) { b.addEventListener('click', function () { var ph = list[Math.max(cur, 0)].p; var w = WORKS.filter(function (o) { return o.photos.indexOf(ph) > -1; })[0]; if (w) openLb(w, w.photos.indexOf(ph)); }); });
    return true;
  }

  /* ---------- reveal / counters / nav / progress ---------- */
  function count(el) {
    var t = +el.dataset.count; if (!t) return; var s;
    function f(ts) { s = s || ts; var p = Math.min((ts - s) / 1500, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); $$('[data-count]', e.target).forEach(count); if (e.target.dataset.count) count(e.target); io.unobserve(e.target); } }); }, { threshold: .15 });
  function watch() { $$('.rv:not(.on),[data-io]:not(.on)').forEach(function (el) { io.observe(el); }); }

  function initChrome() {
    var nav = $('[data-nav]'), prog = $('.prog'), hc = $('[data-hero-content]'), hvw = $('[data-hero-video]');
    var ly = 0;
    function onS() {
      var y = scrollY;
      if (nav) { nav.classList.toggle('solid', y > 40); if (nav.hasAttribute('data-hide')) nav.classList.toggle('hide', y > ly && y > 500); }
      if (hc && y < innerHeight * 1.2) { var hp = Math.min(y / innerHeight, 1); hc.style.transform = 'translateY(' + (hp * 90) + 'px)'; hc.style.opacity = 1 - hp * 1.3; if (hvw) hvw.style.transform = 'scale(' + (1 + hp * .12) + ')'; }
      if (prog) prog.style.transform = 'scaleX(' + (y / Math.max(1, document.documentElement.scrollHeight - innerHeight)) + ')';
      ly = y;
    }
    addEventListener('scroll', onS, { passive: true }); onS();
    var mb = $('[data-menu-btn]'), mn = $('[data-menu]');
    if (mb && mn) {
      mb.addEventListener('click', function () { mn.classList.add('open'); });
      $$('[data-menu-close], [data-menu] a', document).forEach(function (a) { a.addEventListener('click', function () { mn.classList.remove('open'); }); });
    }
    $$('[data-tel]').forEach(function (a) { a.href = 'tel:' + PHONE; });
  }

  /* ---------- WORKS ---------- */
  var lb, lbW, lbI = 0;
  function buildLb() {
    lb = document.createElement('div'); lb.className = 'lbx'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Фото об\'єкта');
    lb.innerHTML = '<div class="lbx-h"><div><h3></h3><p></p></div><div style="display:flex;gap:10px;align-items:center"><a class="lbx-cta" href="#zayavka">Хочу так само</a><button class="lbx-x" aria-label="Закрити">×</button></div></div>' +
      '<div class="lbx-m"><img alt=""><button class="lbx-a lbx-p" aria-label="Попереднє фото">‹</button><button class="lbx-a lbx-n" aria-label="Наступне фото">›</button><span class="lbx-c"></span></div><div class="lbx-r"></div>';
    document.body.appendChild(lb);
    $('.lbx-x', lb).onclick = closeLb; $('.lbx-cta', lb).onclick = closeLb;
    $('.lbx-p', lb).onclick = function () { goLb(lbI - 1); }; $('.lbx-n', lb).onclick = function () { goLb(lbI + 1); };
    var sx = 0; var m = $('.lbx-m', lb);
    m.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    m.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) goLb(lbI + (d < 0 ? 1 : -1)); });
    addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') goLb(lbI + 1); if (e.key === 'ArrowLeft') goLb(lbI - 1); });
  }
  function openLb(w, i) {
    if (!lb) buildLb(); lbW = w;
    $('h3', lb).textContent = w.title; $('.lbx-h p', lb).textContent = w.note;
    $('.lbx-r', lb).innerHTML = w.photos.map(function (p, k) { return '<button aria-label="Фото ' + (k + 1) + '"><img src="' + T(p) + '" alt="" loading="lazy"></button>'; }).join('');
    $$('.lbx-r button', lb).forEach(function (b, k) { b.onclick = function () { goLb(k); }; });
    var many = w.photos.length > 1; $('.lbx-p', lb).style.display = $('.lbx-n', lb).style.display = many ? '' : 'none'; $('.lbx-r', lb).style.display = many ? '' : 'none';
    lb.style.gridTemplateColumns = many ? '' : '1fr';
    goLb(i || 0); lb.classList.add('open'); document.documentElement.style.overflow = 'hidden'; $('.lbx-x', lb).focus();
  }
  function goLb(i) {
    var n = lbW.photos.length; lbI = (i + n) % n; var im = $('.lbx-m img', lb);
    im.style.opacity = 0; setTimeout(function () { im.src = W(lbW.photos[lbI]); im.alt = lbW.title; im.onload = function () { im.style.opacity = 1; }; }, 150);
    $('.lbx-c', lb).textContent = ('0' + (lbI + 1)).slice(-2) + ' / ' + ('0' + n).slice(-2);
    $$('.lbx-r button', lb).forEach(function (b, k) { b.classList.toggle('on', k === lbI); if (k === lbI) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
  }
  function closeLb() { lb.classList.remove('open'); document.documentElement.style.overflow = ''; }

  function initWorks() {
    $$('[data-works]').forEach(function (host) {
      var limit = +(host.dataset.limit || 0), feat = host.hasAttribute('data-feature');
      var chips = document.createElement('div'); chips.className = 'wk-chips'; chips.setAttribute('role', 'tablist');
      var grid = document.createElement('div'); grid.className = 'wk-grid';
      host.appendChild(chips); host.appendChild(grid);
      var more = null;
      WORK_CATS.forEach(function (c) {
        var n = c.id === 'all' ? WORKS.length : WORKS.filter(function (w) { return w.tags.indexOf(c.id) > -1; }).length;
        var b = document.createElement('button'); b.className = 'wk-chip'; b.innerHTML = esc(c.name) + '<sup>' + n + '</sup>'; b.dataset.id = c.id; b.setAttribute('role', 'tab');
        b.onclick = function () { render(c.id); }; chips.appendChild(b);
      });
      var all = false;
      function render(id) {
        $$('.wk-chip', chips).forEach(function (b) { b.classList.toggle('act', b.dataset.id === id); b.setAttribute('aria-selected', b.dataset.id === id); });
        var list = WORKS.filter(function (w) { return id === 'all' || w.tags.indexOf(id) > -1; });
        var shown = limit && !all && id === 'all' ? list.slice(0, limit) : list;
        grid.innerHTML = shown.map(function (w, k) {
          var tag = WORK_CATS.filter(function (c) { return c.id === w.tags[0]; })[0].name;
          return '<button class="wk-card' + (feat && k === 0 && id === 'all' ? ' big' : '') + '" style="animation-delay:' + k * 50 + 'ms" data-w="' + w.id + '"><img src="' + T(w.photos[0]) + '" alt="' + esc(w.title) + '" loading="lazy"><span class="wk-n">' + w.photos.length + ' фото</span><span class="wk-m"><small>' + tag + '</small><h3>' + esc(w.title) + '</h3><span>' + esc(w.note) + '</span></span></button>';
        }).join('');
        $$('.wk-card', grid).forEach(function (b) { b.onclick = function () { openLb(WORKS.filter(function (w) { return w.id === b.dataset.w; })[0], 0); }; });
        if (more) more.style.display = limit && !all && id === 'all' && list.length > limit ? '' : 'none';
      }
      if (limit) {
        more = document.createElement('button'); more.className = 'wk-chip wk-more'; more.style.marginTop = '22px';
        more.textContent = 'Показати всі об\'єкти (' + WORKS.length + ')'; more.onclick = function () { all = true; render('all'); };
        host.appendChild(more);
      }
      render('all');
    });
  }

  /* ---------- CATALOG ---------- */
  var drw, dbg;
  function initCatalog() {
    var host = $('[data-catalog]'); if (!host || !window.CATALOG) return;
    var tabs = document.createElement('div'); tabs.className = 'ct-tabs'; tabs.setAttribute('role', 'tablist');
    var grid = document.createElement('div'); grid.className = 'ct-grid'; host.appendChild(tabs); host.appendChild(grid);
    CATS.forEach(function (c) { var b = document.createElement('button'); b.className = 'ct-tab'; b.textContent = c.name; b.dataset.id = c.id; b.setAttribute('role', 'tab'); b.onclick = function () { set(c.id); }; tabs.appendChild(b); });
    function set(id) {
      $$('.ct-tab', tabs).forEach(function (b) { b.classList.toggle('act', b.dataset.id === id); b.setAttribute('aria-selected', b.dataset.id === id); });
      grid.innerHTML = CATALOG.filter(function (p) { return p.cat === id; }).map(function (p, k) {
        var cols = []; Object.keys(p.colors).forEach(function (g) { p.colors[g].forEach(function (c) { if (cols.indexOf(c) < 0) cols.push(c); }); });
        var sub = cols.length ? cols.length + ' кольорів' : (p.items.length ? p.items.length + ' елементів' : 'Детальніше');
        return '<button class="ct-card" style="animation-delay:' + k * 50 + 'ms" data-p="' + p.id + '"><span class="ct-im"><img src="' + BASE + 'p/' + p.id + '.webp" alt="' + esc(p.name) + '" loading="lazy"></span><span class="ct-tx"><h3>' + esc(p.name) + '</h3>' +
          (cols.length ? '<span class="ct-sw">' + cols.slice(0, 8).map(function (c) { return '<i style="background:' + swatch(c) + '"></i>'; }).join('') + '</span>' : '') + '<p>' + sub + ' · детальніше →</p></span></button>';
      }).join('');
      $$('.ct-card', grid).forEach(function (b) { b.onclick = function () { openP(CATALOG.filter(function (p) { return p.id === b.dataset.p; })[0]); }; });
    }
    set(host.dataset.start || 'roof');
    $$('[data-cat-tab]').forEach(function (a) { a.addEventListener('click', function () { set(a.dataset.catTab); }); });
  }
  function openP(p) {
    if (!drw) {
      dbg = document.createElement('div'); dbg.className = 'ctd-bg'; drw = document.createElement('aside'); drw.className = 'ctd'; drw.setAttribute('role', 'dialog'); drw.setAttribute('aria-modal', 'true');
      document.body.appendChild(dbg); document.body.appendChild(drw); dbg.onclick = closeP;
      addEventListener('keydown', function (e) { if (e.key === 'Escape') closeP(); });
    }
    var cat = CATS.filter(function (c) { return c.id === p.cat; })[0].name;
    var h = '<button class="ctd-x" aria-label="Закрити">×</button><div class="ctd-pic"><img src="' + BASE + 'p/' + p.id + '.webp" alt="' + esc(p.name) + '"><span class="ctd-tint"></span></div><div class="ctd-b"><small>' + cat + '</small><h3>' + esc(p.name) + '</h3>';
    p.desc.forEach(function (d) { h += '<p>' + esc(d) + '</p>'; });
    if (p.specs.length) h += '<h4>Характеристики</h4><div class="ctd-t">' + p.specs.map(function (s) { return '<div><span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b></div>'; }).join('') + '</div>';
    var g = Object.keys(p.colors);
    if (g.length) h += '<h4>Кольори — натисніть, щоб приміряти</h4>' + g.map(function (k) { return '<div class="ctd-g">' + esc(k) + '</div><div class="ctd-sw">' + p.colors[k].map(function (c) { return '<button style="background:' + swatch(c) + '" data-n="' + esc(c) + '" aria-label="' + esc(k + ': ' + c) + '"></button>'; }).join('') + '</div>'; }).join('') + '<div class="ctd-cn">Оберіть колір</div>';
    if (p.adv.length) h += '<h4>Переваги</h4><ul class="ctd-l">' + p.adv.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>';
    if (p.items.length) h += '<h4>Елементи</h4><div class="ctd-ch">' + p.items.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</div>';
    h += '<a class="ctd-go" href="#zayavka">Прорахувати з монтажем</a></div>';
    drw.innerHTML = h; drw.scrollTop = 0;
    $('.ctd-x', drw).onclick = closeP; $('.ctd-go', drw).onclick = function () { closeP(); var q = $('[data-quiz]'); if (q && q._pick) q._pick(p); };
    $$('.ctd-sw button', drw).forEach(function (b) { b.onclick = function () { $$('.ctd-sw button', drw).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); $('.ctd-cn', drw).textContent = b.dataset.n; var t = $('.ctd-tint', drw); t.style.background = swatch(b.dataset.n); t.style.opacity = .8; }; });
    drw.setAttribute('aria-label', p.name); drw.classList.add('open'); dbg.classList.add('open'); document.documentElement.style.overflow = 'hidden'; $('.ctd-x', drw).focus();
  }
  function closeP() { if (!drw) return; drw.classList.remove('open'); dbg.classList.remove('open'); document.documentElement.style.overflow = ''; }

  function send(d) { d.page = location.pathname; d.time = new Date().toISOString(); if (FORM_ENDPOINT) { try { fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }); } catch (_) {} } }

  /* ---------- QUIZ (заявка на прорахунок) ---------- */
  function initQuiz() {
    var host = $('[data-quiz]'); if (!host) return;
    var Q = [
      { k: 'service', q: 'Що потрібно зробити?', o: ['Покрівля', 'Фасад', 'Паркан або навіс', 'Електромонтаж', 'Кілька робіт разом'] },
      { k: 'state', q: 'Яка зараз ситуація?', o: ['Новий будинок — даху ще немає', 'Заміна старого покриття (шифер тощо)', 'Протікає — потрібен ремонт', 'Ще не знаю — потрібна порада'] },
      { k: 'size', q: 'Приблизний розмір об\'єкта', o: ['Невеликий (до 100 м²)', 'Середній (100–200 м²)', 'Великий (понад 200 м²)', 'Не знаю — заміряєте'] },
      { k: 'when', q: 'Коли плануєте роботи?', o: ['Якнайшвидше', 'Протягом 1–2 місяців', 'Цього сезону', 'Поки що прицінююсь'] }
    ];
    var A = {}, step = 0, N = Q.length + 1;
    var h = '<div class="qz-top"><span class="qz-s"></span><span>Безкоштовно · ні до чого не зобов\'язує</span></div><div class="qz-bar"><i></i></div>';
    Q.forEach(function (x, i) { h += '<div class="qz-st" data-i="' + i + '"><h3>' + x.q + '</h3><div class="qz-o">' + x.o.map(function (o) { return '<button type="button">' + o + '</button>'; }).join('') + '</div></div>'; });
    h += '<form class="qz-st" data-i="' + Q.length + '" novalidate><h3>Куди надіслати прорахунок?</h3><div class="qz-f">' +
      '<label>Ваше ім\'я<input name="name" autocomplete="name" placeholder="Як до вас звертатися"></label>' +
      '<label>Телефон*<input name="phone" type="tel" autocomplete="tel" placeholder="0__ ___ __ __" required></label>' +
      '<label>Населений пункт<input name="city" placeholder="Місто або село"></label>' +
      '<label>Як зручніше зв\'язатися<select name="via"><option>Дзвінок</option><option>Viber</option><option>Telegram</option></select></label></div>' +
      '<div class="qz-err" role="alert"></div><div class="qz-nav"><button type="button" class="qz-b qz-back">Назад</button><button class="qz-b qz-go">Отримати прорахунок</button></div></form>' +
      '<div class="qz-st qz-ok" data-i="done"><div class="ic"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17l9-10"/></svg></div><h3>Дякуємо! Заявку прийнято</h3><p class="qz-sum" style="color:var(--q-mut,var(--mut));line-height:1.6"></p><p>Якщо терміново — телефонуйте: <a data-tel href="tel:' + PHONE + '" style="color:var(--acc);font-weight:700">' + PHONE_TXT + '</a></p></div>';
    host.innerHTML = h;
    var sts = $$('.qz-st', host), bar = $('.qz-bar i', host), sl = $('.qz-s', host);
    function go(n) { step = n; sts.forEach(function (s) { s.classList.toggle('on', s.dataset.i == n); }); bar.style.width = (Math.min(n, N) / N * 100) + '%'; sl.textContent = n === 'done' ? 'Готово' : 'Крок ' + (n + 1) + ' з ' + N; if (n === 'done') bar.style.width = '100%'; }
    sts.forEach(function (s, i) { if (i >= Q.length) return; $$('button', s).forEach(function (b) { b.onclick = function () { $$('button', s).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); A[Q[i].k] = b.textContent; setTimeout(function () { go(i + 1); }, 260); }; }); });
    $('.qz-back', host).onclick = function () { go(Q.length - 1); };
    $('form', host).addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target, ph = f.phone.value.replace(/\D/g, '');
      if (ph.length < 10) { $('.qz-err', host).textContent = 'Вкажіть, будь ласка, номер телефону — ми передзвонимо.'; f.phone.focus(); return; }
      $('.qz-err', host).textContent = '';
      var d = { name: f.name.value, phone: f.phone.value, city: f.city.value, via: f.via.value }; Object.keys(A).forEach(function (k) { d[k] = A[k]; });
      send(d);
      $('.qz-sum', host).textContent = [d.service, d.state, d.size, d.when].filter(Boolean).join(' · ') + '. Зв\'яжемося з вами (' + d.via.toLowerCase() + ') на номер ' + d.phone + ' і домовимося про безкоштовний замір.';
      go('done'); f.reset();
    });
    host._pick = function (p) { A.service = p.cat === 'facade' ? 'Фасад' : (p.cat === 'fence' ? 'Паркан або навіс' : 'Покрівля'); A.material = p.name; go(1); };
    $$('[data-quiz-pick]').forEach(function (a) { a.addEventListener('click', function () { A.service = a.dataset.quizPick; go(1); }); });
    go(0);
  }

  function init() { initChrome(); if (!initHeroVideo()) initReel(); initWorks(); initCatalog(); initQuiz(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.DTS = { openLb: openLb, watch: watch, send: send };
})();
