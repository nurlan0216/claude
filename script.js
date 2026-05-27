// ─── STATE ───────────────────────────────────────────────
let formData = {};
let sigInitialized = false;
let drawing = false;

// ─── STEP 1 → 2: SHOW CONTRACT ───────────────────────────
function goToContract() {
  const fio      = document.getElementById('fio').value.trim();
  const iin      = document.getElementById('iin').value.trim();
  const passport = document.getElementById('passport').value.trim();
  const address  = document.getElementById('address').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const email    = document.getElementById('email').value.trim();
  const amount   = document.getElementById('amount').value;

  const errEl = document.getElementById('formError');
  if (!fio) { errEl.textContent = 'Введите ФИО / Т.А.Ә.'; return; }
  if (!iin || iin.length < 12) { errEl.textContent = 'Введите корректный ИИН (12 цифр) / ЖСН'; return; }
  errEl.textContent = '';

  formData = { fio, iin, passport, address, phone, email, amount };

  // Build contract HTML
  const today = new Date().toLocaleDateString('ru-RU');
  const contractHTML = buildContractHTML(formData, today);
  document.getElementById('contractView').innerHTML = contractHTML;

  document.getElementById('stepForm').style.display = 'none';
  document.getElementById('stepContract').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── STEP 2 → 1: BACK ────────────────────────────────────
function goBack() {
  document.getElementById('stepContract').style.display = 'none';
  document.getElementById('stepForm').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── STEP 2 → 3: SIGN ────────────────────────────────────
function goToSign() {
  document.getElementById('stepContract').style.display = 'none';
  document.getElementById('stepSign').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init canvas after layout
  requestAnimationFrame(() => requestAnimationFrame(() => {
    sigInitialized = false;
    initSig();
  }));
}

// ─── BUILD CONTRACT HTML (for preview) ───────────────────
function buildContractHTML(d, date) {
  const dash = (v) => v || '—';
  return `
    <h2>ДОГОВОР ОБ ОКАЗАНИИ УСЛУГ / ҚЫЗМЕТ КӨРСЕТУ ШАРТЫ</h2>
    <div class="sub">Business School Amanat · ${date}</div>

    <div class="ct-parties">
      <div class="ct-cols">
        <div class="ct-col">
          <div class="ct-col-head">Русский</div>
          <div class="ct-info-row"><span class="ct-info-label">Исполнитель:</span><span class="ct-info-val">ИП Business School Amanat</span></div>
          <div class="ct-info-row"><span class="ct-info-label">Заказчик:</span><span class="ct-info-val">${d.fio}</span></div>
          <div class="ct-info-row"><span class="ct-info-label">ИИН:</span><span class="ct-info-val">${d.iin}</span></div>
          ${d.passport ? `<div class="ct-info-row"><span class="ct-info-label">Паспорт:</span><span class="ct-info-val">${d.passport}</span></div>` : ''}
          ${d.address  ? `<div class="ct-info-row"><span class="ct-info-label">Адрес:</span><span class="ct-info-val">${d.address}</span></div>` : ''}
          ${d.phone    ? `<div class="ct-info-row"><span class="ct-info-label">Телефон:</span><span class="ct-info-val">${d.phone}</span></div>` : ''}
          ${d.email    ? `<div class="ct-info-row"><span class="ct-info-label">Email:</span><span class="ct-info-val">${d.email}</span></div>` : ''}
          <div class="ct-info-row"><span class="ct-info-label">Стоимость:</span><span class="ct-info-val">${d.amount}</span></div>
        </div>
        <div class="ct-col">
          <div class="ct-col-head">Қазақша</div>
          <div class="ct-info-row"><span class="ct-info-label">Орындаушы:</span><span class="ct-info-val">ИП Business School Amanat</span></div>
          <div class="ct-info-row"><span class="ct-info-label">Тапсырыс беруші:</span><span class="ct-info-val">${d.fio}</span></div>
          <div class="ct-info-row"><span class="ct-info-label">ЖСН:</span><span class="ct-info-val">${d.iin}</span></div>
          ${d.passport ? `<div class="ct-info-row"><span class="ct-info-label">Төлқұжат:</span><span class="ct-info-val">${d.passport}</span></div>` : ''}
          ${d.address  ? `<div class="ct-info-row"><span class="ct-info-label">Мекенжай:</span><span class="ct-info-val">${d.address}</span></div>` : ''}
          ${d.phone    ? `<div class="ct-info-row"><span class="ct-info-label">Телефон:</span><span class="ct-info-val">${d.phone}</span></div>` : ''}
          ${d.email    ? `<div class="ct-info-row"><span class="ct-info-label">Email:</span><span class="ct-info-val">${d.email}</span></div>` : ''}
          <div class="ct-info-row"><span class="ct-info-label">Сомасы:</span><span class="ct-info-val">${d.amount}</span></div>
        </div>
      </div>
    </div>

    <hr class="ct-hr">

    <div class="ct-section-title">1. Предмет Договора / Шарттың мәні</div>
    <p class="ct-p">1.1. Исполнитель обязуется предоставить Заказчику образовательные услуги по обучению товарному бизнесу, включающие теоретическую и практическую подготовку; доступ в закрытый канал с актуальным ассортиментом товаров в наличии; услугу фулфилмента (в случае предоставления).</p>
    <p class="ct-p">1.2. Заказчик обязуется оплатить указанные услуги в соответствии с условиями Договора.</p>

    <div class="ct-section-title">2. Программа обучения / Оқу бағдарламасы</div>
    <p class="ct-p">2.1. Программа обучения включает: Kaspi магазин, Wildberries, Ozon, Ebay, Shopify; поставщики из Китая, Турции, Америки; доступ к закрытому каналу «Жабық чат»; чек-листы, шаблоны и инструкции; обратная связь от преподавателей.</p>
    <p class="ct-p">2.2. Исполнитель вправе изменять содержание программы в рамках улучшения качества обучения, уведомляя Заказчика.</p>

    <div class="ct-section-title">3. Порядок оказания услуг / Қызмет көрсету тәртібі</div>
    <p class="ct-p">3.1. Обучение проводится в формате онлайн-курсов через интернет. Программа включает лекции, тематические материалы и практические задания.</p>
    <p class="ct-p">3.2. Доступ в закрытый канал с товарами предоставляется на весь срок действия договора.</p>
    <p class="ct-p">3.3. Сроки оказания услуг: обучение — с момента оплаты по соглашению сторон. Доступ к каналу — с момента оплаты до окончания срока обучения.</p>
    <p class="ct-p">3.4. Заказчик несёт ответственность за предоставление корректных данных для доступа к платформе.</p>

    <div class="ct-section-title">4. Порядок оплаты / Төлем тәртібі</div>
    <p class="ct-p">4.1. Стоимость услуг по настоящему договору составляет <strong>${d.amount}</strong>.</p>
    <p class="ct-p">4.2. Оплата осуществляется в размере 100% до начала оказания услуг.</p>
    <p class="ct-p">4.3. Способы оплаты: перевод через Kaspi QR или оплата через Kaspi Red (в рассрочку).</p>
    <p class="ct-p">4.4. Обязательства Заказчика считаются выполненными с момента поступления средств на счёт Исполнителя.</p>
    <p class="ct-p">4.5. <strong>Оплаченные денежные средства возврату не подлежат</strong>, за исключением случаев, предусмотренных законодательством РК.</p>

    <div class="ct-section-title">5. Права и обязанности сторон / Тараптардың құқықтары мен міндеттері</div>
    <p class="ct-p">5.1. Исполнитель обязуется предоставить услуги в полном объёме, обеспечить доступ к каналу и оказывать консультационную поддержку.</p>
    <p class="ct-p">5.2. Исполнитель вправе приостановить доступ при нарушении условий Договора.</p>
    <p class="ct-p">5.3. Заказчик обязуется своевременно оплатить услуги, соблюдать правила пользования платформой и не передавать доступ третьим лицам.</p>
    <p class="ct-p">5.4. Заказчик вправе получить услуги в объёме Договора и требовать разъяснений по программе.</p>

    <div class="ct-section-title">6–9. Ответственность, форс-мажор, срок действия</div>
    <p class="ct-p">6.1. За нарушение условий Договора стороны несут ответственность по законодательству РК.</p>
    <p class="ct-p">7.1. Стороны освобождаются от ответственности при форс-мажорных обстоятельствах, подтверждённых компетентными органами.</p>
    <p class="ct-p">8.1. Договор вступает в силу с момента подписания и полной оплаты. 8.2. Прекращается после выполнения всех обязательств.</p>
    <p class="ct-p">9.1. Все изменения действительны только в письменной форме. 9.2. Споры решаются путём переговоров, при недостижении — в суде.</p>

    <div class="ct-section-title">10. Реквизиты исполнителя / Орындаушы реквизиттері</div>
    <p class="ct-p">Наименование: ИП Business School Amanat &nbsp;|&nbsp; БИН: 010512501511</p>
    <p class="ct-p">ИИК: KZ96722C000028394403</p>
    <p class="ct-p">Адрес: Казахстан, Алматинская обл., с. Каскелен, Толе би, 39а, 050000</p>
    <p class="ct-p">Телефон: +7 777 121 3963 &nbsp;|&nbsp; Лицензия: KZ82UWQ06452512</p>
  `;
}

// ─── SIGNATURE ───────────────────────────────────────────
const sigCanvas = document.getElementById('sigCanvas');
const ctx = sigCanvas.getContext('2d');

function initSig() {
  if (sigInitialized) return;
  const rect = sigCanvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const r = window.devicePixelRatio || 1;
  sigCanvas.width  = rect.width  * r;
  sigCanvas.height = rect.height * r;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(r, r);
  ctx.lineWidth = 2.5;
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';
  ctx.strokeStyle = '#111';
  sigInitialized = true;
}

function getPos(e) {
  const rect = sigCanvas.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
}

function onStart(e) {
  initSig();
  drawing = true;
  document.getElementById('canvasPlaceholder').style.display = 'none';
  const p = getPos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}
function onMove(e) {
  if (!drawing) return;
  if (e.cancelable) e.preventDefault();
  const p = getPos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}
function onEnd() { drawing = false; }

sigCanvas.addEventListener('mousedown',  onStart);
sigCanvas.addEventListener('touchstart', onStart, { passive: true });
sigCanvas.addEventListener('mousemove',  onMove);
sigCanvas.addEventListener('touchmove',  onMove,  { passive: false });
sigCanvas.addEventListener('mouseup',    onEnd);
sigCanvas.addEventListener('mouseleave', onEnd);
sigCanvas.addEventListener('touchend',   onEnd);

function clearSig() {
  if (!sigInitialized) return;
  ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  document.getElementById('canvasPlaceholder').style.display = 'block';
}

function hasSig() {
  if (!sigInitialized) return false;
  const d = ctx.getImageData(0, 0, sigCanvas.width, sigCanvas.height).data;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] > 15) return true;
  }
  return false;
}

// ─── PDF GENERATION ──────────────────────────────────────
async function generatePDF() {
  const errEl = document.getElementById('signError');
  if (!hasSig()) {
    errEl.textContent = 'Поставьте подпись перед скачиванием PDF';
    return;
  }
  errEl.textContent = '';

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const W      = 210;
  const M      = 14;        // margin
  const col1x  = M;
  const col2x  = W / 2 + 3;
  const colW   = W / 2 - M - 4;
  const today  = new Date().toLocaleDateString('ru-RU');
  const d      = formData;

  let y = 18;

  // ── Helpers ──
  const setFont = (size, style) => {
    pdf.setFont('helvetica', style || 'normal');
    pdf.setFontSize(size);
  };
  const setColor = (r, g, b) => pdf.setTextColor(r, g, b);
  const line = (x1, y1, x2, y2, r, g, b) => {
    pdf.setDrawColor(r||180, g||180, b||180);
    pdf.line(x1, y1, x2, y2);
  };

  // Two-column text helper. Returns new Y (max of both columns).
  function twoCol(ruLines, kzLines, startY) {
    setFont(8.5, 'normal');
    setColor(30, 30, 30);
    const lh = 4.2;
    pdf.text(ruLines, col1x, startY);
    pdf.text(kzLines, col2x, startY);
    const h = Math.max(ruLines.length, kzLines.length) * lh;
    return startY + h;
  }

  function wrap(text, maxW) {
    return pdf.splitTextToSize(String(text), maxW);
  }

  // ── TITLE ──
  setFont(14, 'bold');
  setColor(0, 0, 0);
  pdf.text('ДОГОВОР ОБ ОКАЗАНИИ УСЛУГ', W / 2, y, { align: 'center' });
  y += 5.5;
  setFont(8, 'normal');
  setColor(150, 150, 150);
  pdf.text('ҚЫЗМЕТ КӨРСЕТУ ШАРТЫ  ·  Business School Amanat', W / 2, y, { align: 'center' });
  setColor(0, 0, 0);
  y += 5;
  line(M, y, W - M, y);
  y += 5;

  // ── COLUMN HEADERS ──
  setFont(8, 'bold');
  setColor(120, 120, 120);
  pdf.text('РУССКИЙ', col1x, y);
  pdf.text('ҚАЗАҚША', col2x, y);
  setColor(0, 0, 0);
  y += 3;
  line(col1x, y, col1x + colW, y, 200, 169, 110);
  line(col2x, y, col2x + colW, y, 200, 169, 110);
  y += 5;

  // ── PARTY INFO ──
  const infoRows = [
    ['г. Алматы', 'Алматы қ.'],
    ['Исполнитель: ИП Business School Amanat', 'Орындаушы: ИП Business School Amanat'],
    ['Заказчик: ' + d.fio, 'Тапсырыс беруші: ' + d.fio],
    ['ИИН: ' + d.iin, 'ЖСН: ' + d.iin],
  ];
  if (d.passport) infoRows.push(['Паспорт: ' + d.passport, 'Төлқұжат: ' + d.passport]);
  if (d.address)  infoRows.push(['Адрес: ' + d.address, 'Мекенжай: ' + d.address]);
  if (d.phone)    infoRows.push(['Телефон: ' + d.phone, 'Телефон: ' + d.phone]);
  if (d.email)    infoRows.push(['Email: ' + d.email, 'Email: ' + d.email]);
  infoRows.push(['Стоимость: ' + d.amount, 'Сомасы: ' + d.amount]);

  setFont(8.5, 'normal');
  infoRows.forEach(([ru, kz]) => {
    const lRu = wrap(ru, colW);
    const lKz = wrap(kz, colW);
    const h   = Math.max(lRu.length, lKz.length) * 4.2;
    setColor(30, 30, 30);
    pdf.text(lRu, col1x, y);
    pdf.text(lKz, col2x, y);
    y += h + 0.8;
  });

  y += 3;
  line(M, y, W - M, y);
  y += 6;

  // ── CONTRACT BODY ──
  const sections = [
    {
      title: '1. Предмет Договора / Шарттың мәні',
      ru: [
        '1.1. Исполнитель обязуется предоставить образовательные услуги по',
        'обучению товарному бизнесу, доступ в закрытый канал с ассортиментом',
        'товаров и услугу фулфилмента (при наличии).',
        '1.2. Заказчик обязуется оплатить услуги согласно условиям Договора.',
      ],
      kz: [
        '1.1. Орындаушы тауарлық бизнес бойынша білім беру қызметтерін,',
        'тауарлар бар жабық каналға қолжетімділікті және фулфилмент',
        'қызметін (қажет болса) ұсынуға міндеттенеді.',
        '1.2. Тапсырыс беруші шарт талаптарына сәйкес төлем жасайды.',
      ],
    },
    {
      title: '2. Программа обучения / Оқу бағдарламасы',
      ru: [
        '2.1. Kaspi магазин, Wildberries, Ozon, Ebay, Shopify; поставщики',
        'Китай/Турция/Америка; «Жабық чат»; чек-листы и консультации.',
        '2.2. Исполнитель вправе изменять программу, уведомив Заказчика.',
      ],
      kz: [
        '2.1. Kaspi дүкен, Wildberries, Ozon, Ebay, Shopify; Қытай/Түркия/',
        'Америка жеткізушілері; «Жабық чат»; чек-листер және кеңестер.',
        '2.2. Орындаушы бағдарламаны өзгертуге хабарлаған жағдайда құқылы.',
      ],
    },
    {
      title: '3. Порядок оказания услуг / Қызмет тәртібі',
      ru: [
        '3.1. Обучение проводится онлайн; включает лекции и практику.',
        '3.2. Доступ к закрытому каналу — на весь срок действия Договора.',
        '3.3. Начало — с момента оплаты, по соглашению сторон.',
        '3.4. Заказчик отвечает за корректность своих данных.',
      ],
      kz: [
        '3.1. Оқу онлайн форматта жүргізіледі; дәрістер мен тапсырмалар.',
        '3.2. Жабық каналға қолжетімділік — шарт мерзімі ішінде.',
        '3.3. Басталуы — төлем сәтінен, тараптар келісімімен.',
        '3.4. Тапсырыс беруші деректерінің дұрыстығына жауапты.',
      ],
    },
    {
      title: '4. Оплата / Төлем — ' + d.amount,
      ru: [
        '4.1. Стоимость услуг: ' + d.amount + '.',
        '4.2. Оплата — 100% до начала оказания услуг.',
        '4.3. Способы: Kaspi QR или Kaspi Red (рассрочка).',
        '4.5. Оплаченные средства ВОЗВРАТУ НЕ ПОДЛЕЖАТ,',
        '      кроме случаев по законодательству РК.',
      ],
      kz: [
        '4.1. Қызмет құны: ' + d.amount + '.',
        '4.2. Төлем — қызмет басталғанға дейін 100%.',
        '4.3. Тәсілдер: Kaspi QR немесе Kaspi Red (бөліп төлеу).',
        '4.5. Төленген қаражат ҚАЙТАРЫЛМАЙДЫ,',
        '      ҚР заңнамасында көзделген жағдайлардан басқа.',
      ],
    },
    {
      title: '5–9. Права сторон, ответственность, форс-мажор, срок',
      ru: [
        '5. Исполнитель оказывает услуги в полном объёме и поддерживает',
        'консультационно. Заказчик оплачивает, соблюдает правила платформы,',
        'не передаёт доступ третьим лицам.',
        '6. Ответственность — по законодательству РК.',
        '7. Форс-мажор освобождает от ответственности при подтверждении.',
        '8. Договор вступает в силу с момента подписания и оплаты.',
        '9. Изменения — только письменно. Споры — переговоры, затем суд.',
      ],
      kz: [
        '5. Орындаушы қызметті толық көлемде көрсетеді, кеңес береді.',
        'Тапсырыс беруші уақытында төлейді, ережелерді сақтайды,',
        'үшінші тұлғаларға қолжетімділік бермейді.',
        '6. Жауапкершілік — ҚР заңнамасы бойынша.',
        '7. Форс-мажор — растаған жағдайда жауапкершіліктен босатады.',
        '8. Шарт қол қойған және төлем жасаған сәттен күшіне енеді.',
        '9. Өзгерістер — жазбаша ғана. Дауларды — келіссөз, сот.',
      ],
    },
    {
      title: '10. Реквизиты исполнителя / Орындаушы деректемелері',
      ru: [
        'ИП Business School Amanat  |  БИН: 010512501511',
        'ИИК: KZ96722C000028394403',
        'Адрес: Алматинская обл., с. Каскелен, Толе би, 39а',
        'Тел.: +7 777 121 3963  |  Лиц.: KZ82UWQ06452512',
      ],
      kz: [
        'ИП Business School Amanat  |  БСН: 010512501511',
        'ЖСК: KZ96722C000028394403',
        'Мекенжай: Алматы обл., Қаскелен, Төле би, 39а',
        'Тел.: +7 777 121 3963  |  Лиц.: KZ82UWQ06452512',
      ],
    },
  ];

  sections.forEach(s => {
    // Check page overflow
    if (y > 255) { pdf.addPage(); y = 14; }

    // Section title
    setFont(9, 'bold');
    setColor(0, 0, 0);
    pdf.text(s.title, M, y);
    y += 5;

    // Two-column body
    const ruWrapped = s.ru.flatMap(l => wrap(l, colW));
    const kzWrapped = s.kz.flatMap(l => wrap(l, colW));
    const lh = 4.2;
    setFont(8, 'normal');
    setColor(30, 30, 30);
    pdf.text(ruWrapped, col1x, y);
    pdf.text(kzWrapped, col2x, y);
    y += Math.max(ruWrapped.length, kzWrapped.length) * lh + 5;

    line(M, y - 2, W - M, y - 2);
    y += 3;
  });

  // ── SIGNATURES ──
  if (y > 230) { pdf.addPage(); y = 14; }

  y += 4;
  setFont(9, 'bold');
  setColor(0, 0, 0);
  pdf.text('ПОДПИСИ СТОРОН / ТАРАПТАРДЫҢ ҚОЛДАРЫ', M, y);
  y += 7;

  // Executor signature line
  setFont(8, 'normal');
  setColor(80, 80, 80);
  pdf.text('Исполнитель / Орындаушы', col1x, y);
  pdf.text('Заказчик / Тапсырыс беруші', col2x, y);
  y += 4;

  // Executor blank line
  line(col1x, y + 18, col1x + colW, y + 18);
  setFont(7.5, 'normal');
  setColor(120, 120, 120);
  pdf.text('Ералиев Б.Н.', col1x, y + 23);

  // Customer — insert canvas signature image
  const sigImg = sigCanvas.toDataURL('image/png');
  pdf.addImage(sigImg, 'PNG', col2x, y, colW * 0.75, 22);
  line(col2x, y + 22, col2x + colW, y + 22);
  setFont(7.5, 'normal');
  setColor(120, 120, 120);
  pdf.text(d.fio, col2x, y + 27);

  y += 32;

  // ── FOOTER ──
  line(M, y, W - M, y);
  y += 4;
  setFont(7.5, 'normal');
  setColor(160, 160, 160);
  pdf.text('Дата подписания / Қол қою күні: ' + today, M, y);
  pdf.text('ИИН / ЖСН: ' + d.iin, W - M, y, { align: 'right' });

  // Save
  const safeName = d.fio.replace(/\s+/g, '_').replace(/[^a-zA-Zа-яА-ЯёЁ_]/g, '');
  pdf.save('Dogovor_Amanat_' + safeName + '_' + today.replace(/\./g, '-') + '.pdf');

  // Show done
  document.getElementById('stepSign').style.display = 'none';
  document.getElementById('stepDone').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── RESTART ─────────────────────────────────────────────
function restart() {
  ['fio','iin','passport','address','phone','email'].forEach(id => {
    document.getElementById(id).value = '';
  });
  formData = {};
  sigInitialized = false;
  document.getElementById('stepDone').style.display     = 'none';
  document.getElementById('stepForm').style.display     = 'block';
  document.getElementById('stepContract').style.display = 'none';
  document.getElementById('stepSign').style.display     = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}