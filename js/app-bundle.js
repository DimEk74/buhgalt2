// js/app-bundle.js
// Единый автономный бандл с прилетом крупного SVG-камня слева сверху

(function() {
  // ── 1. Notibot Bridge ──────────────────────────────────
  let _state = { user: null, app: null, colors: null };
  const _listeners = [];

  function initBridge(onReady) {
    let isReady = false;
    const handleReady = (user, app) => {
      if (isReady) return;
      isReady = true;
      _state = { user: user || {}, app: app || {}, colors: app?.colors };
      _applyTheme(_state.colors);
      if (onReady) onReady(_state);
      _listeners.forEach(fn => fn(_state));
    };

    if (window.notibot && typeof window.notibot.onUpdate === 'function') {
      window.notibot.onUpdate((user, app) => handleReady(user, app));
    }
    setTimeout(() => handleReady(_state.user, _state.app), 120);
  }

  function getState() {
    return _state;
  }

  function hapticImpact(style = 'medium') {
    if (window.notibot?.hapticImpact) window.notibot.hapticImpact(style);
  }

  function hapticSelection() {
    if (window.notibot?.hapticSelection) window.notibot.hapticSelection();
  }

  async function submitForm(formId, answers) {
    if (window.notibot && typeof window.notibot.submitForm === 'function') {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new window.NotibotBridgeError({
            origin: 'client',
            code: 'ERR_RATE_LIMIT',
            message: 'Превышено время ожидания ответа от Notibot (10 сек)'
          }));
        }, 10000);

        window.notibot.submitForm(formId, answers)
          .then((res) => {
            clearTimeout(timeout);
            resolve(res);
          })
          .catch((err) => {
            clearTimeout(timeout);
            reject(err);
          });
      });
    }

    console.log("Mock submitForm call (вне Notibot):", formId, answers);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
  }

  function _applyTheme(colors) {
    if (!colors) return;
    const r = document.documentElement;
    if (colors.background) r.style.setProperty('--color-bg', colors.background);
    if (colors.textPrimary) r.style.setProperty('--color-text', colors.textPrimary);
    if (colors.textSecondary) r.style.setProperty('--color-muted', colors.textSecondary);
    if (colors.primaryMain) r.style.setProperty('--color-accent', colors.primaryMain);
  }

  // ── 2. Utils ───────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatPrice(amount, currency = '₽') {
    return `${Number(amount).toLocaleString('ru-RU')} ${currency}`;
  }

  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  // ── 3. Crash Test Data ─────────────────────────────────
  const crashQuestions = [
    {
      id: 1, title: "Проверка №1: Запрос от ФНС",
      question: "Завтра приходит запрос из налоговой с дедлайном 5 дней. Что происходит?",
      options: [
        { text: "Открываем ЭДО, все документы на месте, ответим за 1 день", damage: 0 },
        { text: "Звоню бухгалтеру. Жду. Нервничаю. Ответ соберут за 4 дня", damage: 35 },
        { text: "Паника. Документов нет. Бухгалтер не берёт трубку", damage: 75 }
      ]
    },
    {
      id: 2, title: "Проверка №2: Увольнение бухгалтера",
      question: "Бухгалтер сообщает: «Я ухожу с понедельника». Ваши действия?",
      options: [
        { text: "Доступы, базы и 1С под моим контролем. Найдем замену за 3 дня", damage: 0 },
        { text: "Начну искать, но база и ЭЦП у нее на ноутбуке", damage: 35 },
        { text: "Катастрофа. Не знаю где база, пароли и что сдавать", damage: 75 }
      ]
    },
    {
      id: 3, title: "Проверка №3: Реформа НДС 2026",
      question: "С 2026 лимиты УСН меняются. Бухгалтер уже просчитал сценарии?",
      options: [
        { text: "Да. Есть 3 сценария оптимизации и расчет цен", damage: 0 },
        { text: "Сказала «будем разбираться по ходу дела»", damage: 35 },
        { text: "Я не знаю про реформу, бухгалтер ничего не говорил", damage: 75 }
      ]
    },
    {
      id: 4, title: "Проверка №4: Прогнозирование налогов",
      question: "За сколько дней до уплаты вы узнаёте точную сумму налога?",
      options: [
        { text: "За 2–3 недели до конца квартала с планом платежей", damage: 0 },
        { text: "За 2–3 дня до крайнего срока", damage: 35 },
        { text: "В день уплаты вечером в виде факта перед фактом", damage: 75 }
      ]
    },
    {
      id: 5, title: "Проверка №5: Законная оптимизация",
      question: "Сколько решений по экономии налогов бухгалтер предложил за год?",
      options: [
        { text: "Регулярно предлагает льготы, вычеты и патенты", damage: 0 },
        { text: "Один раз смутно, когда я сам спросил", damage: 35 },
        { text: "Никогда. Говорит «скажите спасибо что не штрафуют»", damage: 75 }
      ]
    },
    {
      id: 6, title: "Проверка №6: Блокировка по 115-ФЗ",
      question: "Банк прислал запрос по смыслу операции. Что происходит?",
      options: [
        { text: "У бухгалтера готов комплект документов за 2 часа", damage: 0 },
        { text: "Собираем 3 дня всей компанией, рискуя блокировкой", damage: 35 },
        { text: "Бухгалтер говорит: «Вы сами вывели, решайте сами»", damage: 75 }
      ]
    },
    {
      id: 7, title: "Проверка №7: Контроль первички",
      question: "Кто занимается сбором недостающих актов у контрагентов?",
      options: [
        { text: "Бухгалтер через ЭДО и автонапоминания", damage: 0 },
        { text: "Менеджеры по продажам из-под палки", damage: 35 },
        { text: "Я лично звоню директорам поставщиков и выбиваю акты", damage: 75 }
      ]
    },
    {
      id: 8, title: "Проверка №8: Финансовая ответственность",
      question: "Что произойдет по договору при штрафе ФНС по вине бухгалтера?",
      options: [
        { text: "Штраф 100% компенсирует страховка аутсорсера", damage: 0 },
        { text: "Вернут максимум стоимость услуг за месяц", damage: 35 },
        { text: "Нет договора / фрилансер отключит телефон", damage: 75 }
      ]
    },
    {
      id: 9, title: "Проверка №9: Ночной сон директора",
      question: "Как часто вы не можете заснуть из-за мыслей о налогах?",
      options: [
        { text: "Никогда. Я уверен в безопасности учета", damage: 0 },
        { text: "2–3 раза в месяц перед сдачей отчетности", damage: 35 },
        { text: "Каждую неделю. Постоянная фоновая тревога", damage: 75 }
      ]
    }
  ];

  // ── 4. UI-Компонент Сцены ──────────────────────────────
  function renderCrashTestQuiz(state = {}) {
    const user = state?.user;
    const userName = user?.displayName || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Гость';
    const avatarUrl = user?.photo_url || user?.avatar || user?.photoUrl;
    const initial = (userName[0] || 'Г').toUpperCase();

    const userAvatarHtml = avatarUrl
      ? `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(userName)}" class="w-6 h-6 rounded-full object-cover border border-[#CACC90]/40 shrink-0" />`
      : `<div class="w-6 h-6 rounded-full bg-[#CACC90]/20 text-[#CACC90] font-bold text-[10px] flex items-center justify-center border border-[#CACC90]/30 shrink-0">${escapeHtml(initial)}</div>`;

    return `
      <!-- Top Site Header Finexpert -->
      <header class="w-full max-w-2xl mx-auto mb-4 px-2 pt-3">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#354251] pb-3">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#CACC90] text-[#151617] font-serif font-bold text-lg flex items-center justify-center shadow-md">Ф</div>
            <div class="flex flex-col">
              <span class="font-serif text-lg font-bold tracking-tight text-white leading-none">ФИНЭКСПЕРТ</span>
              <span class="text-[10px] text-[#999999] tracking-wider uppercase">Аутсорсинг бухгалтерии</span>
            </div>
          </div>

          <!-- Notibot User Profile & Contacts -->
          <div class="flex items-center gap-3">
            <!-- Notibot User Avatar & Name -->
            <div id="notibot-user-badge" class="flex items-center gap-2 px-3 py-1.5 bg-[#1E2021] border border-[#354251] rounded-full text-xs shadow-sm">
              ${userAvatarHtml}
              <span class="text-slate-200 font-medium text-xs truncate max-w-[120px]">${escapeHtml(userName)}</span>
            </div>

            <div class="hidden sm:flex flex-col text-right text-xs text-[#999999]">
              <a href="tel:88006002506" class="text-white font-semibold hover:text-[#CACC90] transition-colors">8 (800) 600-25-06</a>
              <span>Екатеринбург, Горького 65</span>
            </div>
          </div>
        </div>

        <!-- Ratings & Trust Badges -->
        <div class="grid grid-cols-3 gap-2 mt-3 text-center">
          <div class="bg-[#1E2021] border border-[#354251] rounded-xl p-2">
            <div class="text-[#CACC90] font-bold text-xs sm:text-sm">ТОП-3</div>
            <div class="text-[10px] text-[#999999]">4 года подряд</div>
          </div>
          <div class="bg-[#1E2021] border border-[#354251] rounded-xl p-2">
            <div class="text-[#CACC90] font-bold text-xs sm:text-sm">4,9 ★</div>
            <div class="text-[10px] text-[#999999]">Яндекс Карты</div>
          </div>
          <div class="bg-[#1E2021] border border-[#354251] rounded-xl p-2">
            <div class="text-[#CACC90] font-bold text-xs sm:text-sm">10 млн ₽</div>
            <div class="text-[10px] text-[#999999]">Гарантия ФО</div>
          </div>
        </div>
      </header>

      <div id="crash-quiz-app" class="w-full max-w-2xl mx-auto bg-[#1E2021] text-white rounded-3xl p-4 sm:p-6 border border-[#354251] shadow-2xl overflow-hidden relative">
        <div class="mb-4 bg-[#151617] p-3.5 rounded-2xl border border-[#354251]">
          <div class="flex justify-between items-center text-xs mb-2 font-medium">
            <span id="quiz-step-title" class="text-slate-200 font-semibold tracking-wide flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#CACC90] animate-pulse"></span>
              Краш-тест вашей бухгалтерии
            </span>
            <span id="quiz-damage-text" class="text-[#CACC90] font-bold bg-[#CACC90]/10 px-3 py-1 rounded-full border border-[#CACC90]/30 shadow-sm">Урон: 0%</span>
          </div>
          <div class="w-full h-2.5 bg-[#1E2021] rounded-full overflow-hidden p-0.5 border border-[#354251]">
            <div id="quiz-damage-bar" class="h-full bg-[#CACC90] rounded-full w-0 transition-all duration-500 shadow-[0_0_12px_rgba(202,204,144,0.5)]"></div>
          </div>
        </div>

        <!-- STAGE WITH CINEMATIC VIDEO BACKGROUND & SVG ROCK FLYING FROM TOP-LEFT (16:9) -->
        <div id="car-stage" class="relative w-full h-48 sm:h-56 rounded-2xl border border-[#354251] overflow-hidden shadow-2xl mb-5 bg-black">
          <div class="absolute inset-0 overflow-hidden">
            <video id="scene-bg-video" autoplay loop muted playsinline class="w-full h-full object-cover veo-drive-scene transition-all duration-500">
              <source src="./Photorealistic_cinematic_short.mp4" type="video/mp4">
              <source src="./img/Photorealistic_cinematic_short.mp4" type="video/mp4">
            </video>
          </div>
          
          <div class="absolute inset-0 speed-overlay opacity-25 pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
          <div id="damage-filter-overlay" class="absolute inset-0 opacity-0 bg-red-900/40 mix-blend-color-burn transition-opacity duration-300 pointer-events-none"></div>

          <!-- 1. Натуральный 3D Гранитный Камень -->
          <img id="strike-pebble" src="./img/rock.svg" alt="Камень" class="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-20 z-30 opacity-0 pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.95)]" />

          <!-- 2. Разлетающиеся каменные осколки и крошка -->
          <div id="rock-shards-group" class="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-16 z-30 pointer-events-none opacity-0">
            <div class="absolute w-3 h-3 bg-[#475569] border border-[#94a3b8] rounded-sm shards-anim" style="--shard-x: 55px; --shard-y: -45px; --shard-r: 320deg;"></div>
            <div class="absolute w-2.5 h-2.5 bg-[#334155] border border-[#cbd5e1] rounded-sm shards-anim" style="--shard-x: -60px; --shard-y: -35px; --shard-r: -280deg;"></div>
            <div class="absolute w-2 h-2 bg-[#1e293b] border border-[#94a3b8] rounded-sm shards-anim" style="--shard-x: 40px; --shard-y: 50px; --shard-r: 400deg;"></div>
            <div class="absolute w-2 h-2 bg-[#64748b] rounded-sm shards-anim" style="--shard-x: -45px; --shard-y: 40px; --shard-r: -360deg;"></div>
          </div>

          <!-- 3. Кольцевая ударная волна и сноп искр -->
          <div id="impact-shockwave" class="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-[#F4EBBE] z-30 opacity-0 pointer-events-none mix-blend-screen shadow-[0_0_20px_#F4EBBE]"></div>
          <div id="spark-effect" class="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-[#FEF08A] via-[#F97316] to-[#EF4444] rounded-full blur-md z-30 opacity-0 pointer-events-none mix-blend-screen"></div>

          <!-- 4. Паутина трещин лобового стекла -->
          <svg id="spider-glass-crack" class="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 z-25 opacity-0 pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="4" fill="#ffffff"/>
            <path d="M50 50 L20 15 M50 50 L80 18 M50 50 L92 52 M50 50 L75 88 M50 50 L25 85 M50 50 L8 50" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M35 32 Q 50 25, 65 34 M68 36 Q 78 50, 72 68 M70 70 Q 50 78, 36 68 M34 66 Q 22 50, 34 33" stroke="rgba(255,255,255,0.75)" stroke-width="1.2" fill="none"/>
          </svg>

          <!-- РЕАЛИСТИЧНЫЕ ДЕТАЛИ АВТОМОБИЛЯ -->
          <!-- 1. Кованый титановый диск с тормозным ротором и красным суппортом Brembo -->
          <svg id="car-part-wheel" class="absolute top-10 left-1/2 w-20 h-20 z-40 opacity-0 pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" fill="#090d16" stroke="#1e293b" stroke-width="5"/>
            <circle cx="60" cy="60" r="48" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <circle cx="60" cy="60" r="38" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="60" cy="60" r="28" fill="#334155" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
            <path d="M 78,35 Q 98,60 78,85 L 68,80 Q 84,60 68,40 Z" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
            <text x="80" y="62" fill="#ffffff" font-size="6" font-weight="bold" transform="rotate(90 80 62)">BREMBO</text>
            <g stroke="#f8fafc" stroke-width="3.5" stroke-linecap="round">
              <line x1="60" y1="18" x2="60" y2="46"/>
              <line x1="60" y1="74" x2="60" y2="102"/>
              <line x1="18" y1="60" x2="46" y2="60"/>
              <line x1="74" y1="60" x2="102" y2="60"/>
              <line x1="30" y1="30" x2="50" y2="50"/>
              <line x1="70" y1="70" x2="90" y2="90"/>
              <line x1="30" y1="90" x2="50" y2="70"/>
              <line x1="70" y1="50" x2="90" y2="30"/>
            </g>
            <circle cx="60" cy="60" r="14" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
            <circle cx="60" cy="60" r="7" fill="#CACC90"/>
          </svg>

          <!-- 2. Карбоновое боковое зеркало с LED повторителем -->
          <svg id="car-part-mirror" class="absolute top-12 left-1/2 w-22 h-16 z-40 opacity-0 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]" viewBox="0 0 120 90">
            <defs>
              <linearGradient id="mirrorCarbon2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#334155"/>
                <stop offset="50%" stop-color="#0f172a"/>
                <stop offset="100%" stop-color="#020617"/>
              </linearGradient>
            </defs>
            <path d="M 20,45 Q 35,15 95,20 Q 115,40 100,70 Q 50,75 20,55 Z" fill="url(#mirrorCarbon2)" stroke="#64748b" stroke-width="2"/>
            <path d="M 28,45 Q 40,24 88,28 Q 100,42 90,62 Q 52,65 28,50 Z" fill="#94a3b8" opacity="0.6" stroke="#ffffff" stroke-width="1.5"/>
            <path d="M 35,52 Q 70,58 108,42" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
            <path d="M 12,50 L 22,48 L 22,58 Z" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          </svg>

          <!-- 3. Матричная лазерная фара (Matrix LED Headlight) -->
          <svg id="car-part-headlight" class="absolute top-14 left-1/2 w-24 h-16 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_25px_rgba(56,189,248,0.9)]" viewBox="0 0 130 80">
            <defs>
              <linearGradient id="headlightGlass2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.9"/>
                <stop offset="50%" stop-color="#0f172a" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.9"/>
              </linearGradient>
            </defs>
            <path d="M 15,20 Q 80,10 118,35 Q 110,65 50,68 Q 18,65 15,20 Z" fill="url(#headlightGlass2)" stroke="#38bdf8" stroke-width="2.5"/>
            <circle cx="48" cy="40" r="16" fill="#0369a1" stroke="#e0f2fe" stroke-width="2.5"/>
            <circle cx="48" cy="40" r="9" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
            <circle cx="85" cy="42" r="12" fill="#0284c7" stroke="#e0f2fe" stroke-width="2"/>
            <circle cx="85" cy="42" r="6" fill="#ffffff"/>
            <path d="M 22,25 Q 75,18 110,38" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 15,45 Q 5,48 2,58 M 15,55 Q 8,62 5,72" fill="none" stroke="#ef4444" stroke-width="2"/>
            <circle cx="2" cy="58" r="2.5" fill="#fef08a"/>
            <circle cx="5" cy="72" r="2.5" fill="#38bdf8"/>
          </svg>

          <!-- 4. Карбоновый передний сплиттер / Бампер -->
          <svg id="car-part-bumper" class="absolute top-14 left-1/2 w-28 h-14 z-40 opacity-0 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]" viewBox="0 0 140 60">
            <defs>
              <linearGradient id="carbonPattern2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="50%" stop-color="#090d16"/>
                <stop offset="100%" stop-color="#334155"/>
              </linearGradient>
            </defs>
            <path d="M 5,38 Q 70,8 135,38 L 125,52 Q 70,25 15,52 Z" fill="url(#carbonPattern2)" stroke="#64748b" stroke-width="2.5"/>
            <line x1="45" y1="22" x2="48" y2="40" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="95" y1="22" x2="92" y2="40" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M 5,38 L 2,20 L 12,28 Z" fill="#ef4444"/>
            <path d="M 135,38 L 138,20 L 128,28 Z" fill="#ef4444"/>
          </svg>

          <!-- 5. Осколки многослойного триплекс-стекла -->
          <svg id="car-part-glass" class="absolute top-10 left-1/2 w-24 h-24 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" viewBox="0 0 100 100">
            <polygon points="15,10 52,38 12,65" fill="rgba(255,255,255,0.85)" stroke="#ffffff" stroke-width="2"/>
            <line x1="18" y1="16" x2="45" y2="35" stroke="#38bdf8" stroke-width="1.5"/>
            <polygon points="58,12 92,48 48,58" fill="rgba(186,230,253,0.85)" stroke="#ffffff" stroke-width="2"/>
            <polygon points="28,52 75,92 18,96" fill="rgba(224,242,254,0.8)" stroke="#38bdf8" stroke-width="2"/>
            <polygon points="78,55 96,75 80,88" fill="rgba(255,255,255,0.9)" stroke="#ffffff" stroke-width="1.5"/>
          </svg>
        </div>

        <div id="quiz-card-container"></div>
      </div>
    `;
  }

  function initCrashTestQuiz(onOpenDrawer) {
    let currentIndex = 0;
    let totalDamage = 0;
    let hitCount = 0;

    const cardContainer = document.getElementById('quiz-card-container');
    const damageBar = document.getElementById('quiz-damage-bar');
    const damageText = document.getElementById('quiz-damage-text');
    const stepTitle = document.getElementById('quiz-step-title');
    const appContainer = document.getElementById('crash-quiz-app');
    const sceneBg = document.getElementById('scene-bg-video') || document.getElementById('scene-bg-img');
    const damageFilter = document.getElementById('damage-filter-overlay');

    function renderStartScreen() {
      cardContainer.innerHTML = `
        <div class="text-center py-4 px-2 fade-in space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-[#CACC90]/15 border border-[#CACC90]/30 text-[#CACC90] text-xs font-semibold rounded-full shadow-sm">
            ⚡ 60 секунд • Экспресс-Аудит
          </div>
          <h1 class="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
            Аутсорсинг бухгалтерии 
            <span class="block text-[#DEDEDE] italic text-xl sm:text-2xl mt-1">для малого, среднего и крупного бизнеса</span>
          </h1>
          <p class="text-[#999999] text-sm leading-relaxed max-w-md mx-auto">
            Пройдите короткий опрос за 1 минуту и получите <strong class="text-white">БЕСПЛАТНО</strong> экспресс аудит Вашей бухгалтерской базы.
          </p>
          <button id="btn-start-quiz" class="iksweb btn-pulse text-base sm:text-lg w-full max-w-xs mx-auto my-2">
            Пройти краш-тест →
          </button>
        </div>
      `;
      document.getElementById('btn-start-quiz').addEventListener('click', () => {
        hapticImpact('heavy');
        renderQuestion(0);
      });
    }

    function renderQuestion(index) {
      currentIndex = index;
      const q = crashQuestions[index];
      stepTitle.textContent = q.title;

      const optionsHtml = q.options.map((opt, i) => `
        <button data-damage="${opt.damage}" class="group quiz-opt-btn w-full text-left p-4 sm:p-4.5 min-h-[64px] rounded-2xl transition-all duration-200 shadow-md flex items-center gap-3.5 btn-press cursor-pointer relative overflow-hidden">
          <span class="w-7 h-7 rounded-xl bg-[#CACC90]/20 text-[#CACC90] border border-[#CACC90]/30 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#CACC90] group-hover:text-[#151617] group-hover:border-transparent transition-all shadow-sm">${i+1}</span>
          <span class="text-sm sm:text-[15px] font-medium text-slate-100 leading-snug group-hover:text-white transition-colors">${escapeHtml(opt.text)}</span>
        </button>
      `).join('');

      cardContainer.innerHTML = `
        <div class="fade-in space-y-4">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#CACC90]/15 text-[#CACC90] border border-[#CACC90]/30 shadow-sm">
              Этап ${index + 1} из ${crashQuestions.length}
            </span>
          </div>
          <h3 class="font-serif text-lg sm:text-xl text-white leading-relaxed tracking-wide">${escapeHtml(q.question)}</h3>
          <div class="space-y-3.5 pt-1">${optionsHtml}</div>
        </div>
      `;

      cardContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const dam = parseInt(e.currentTarget.dataset.damage, 10);
          handleAnswer(dam);
        });
      });
    }

    function handleAnswer(damage) {
      totalDamage += damage;
      hapticImpact('heavy');

      if (damage > 0) {
        hitCount++;
        const pebble = document.getElementById('strike-pebble');
        const shardsGroup = document.getElementById('rock-shards-group');
        const shockwave = document.getElementById('impact-shockwave');
        const spark = document.getElementById('spark-effect');
        const spider = document.getElementById('spider-glass-crack');

        const partWheel = document.getElementById('car-part-wheel');
        const partMirror = document.getElementById('car-part-mirror');
        const partHeadlight = document.getElementById('car-part-headlight');
        const partBumper = document.getElementById('car-part-bumper');
        const partGlass = document.getElementById('car-part-glass');

        if (pebble) {
          pebble.classList.remove('pebble-anim');
          void pebble.offsetWidth;
          pebble.classList.add('pebble-anim');
        }

        setTimeout(() => {
          if (shockwave) {
            shockwave.classList.remove('shockwave-anim');
            void shockwave.offsetWidth;
            shockwave.classList.add('shockwave-anim');
          }
          if (spark) {
            spark.classList.remove('spark-flash');
            void spark.offsetWidth;
            spark.classList.add('spark-flash');
          }
          if (shardsGroup) {
            shardsGroup.classList.remove('opacity-0');
            shardsGroup.querySelectorAll('div').forEach(s => {
              s.classList.remove('shards-anim');
              void s.offsetWidth;
              s.classList.add('shards-anim');
            });
          }
          if (spider) {
            spider.classList.remove('spider-anim');
            void spider.offsetWidth;
            spider.classList.add('spider-anim');
          }

          // Отлетает ровно ОДНА деталь за прилет
          const partsList = [
            { el: partWheel, anim: 'fly-wheel' },
            { el: partMirror, anim: 'fly-mirror' },
            { el: partHeadlight, anim: 'fly-headlight' },
            { el: partBumper, anim: 'fly-bumper' },
            { el: partGlass, anim: 'fly-glass' }
          ];

          const partIndex = (hitCount - 1) % partsList.length;
          const singlePart = partsList[partIndex];

          if (singlePart && singlePart.el) {
            singlePart.el.classList.remove(singlePart.anim);
            void singlePart.el.offsetWidth;
            singlePart.el.classList.add(singlePart.anim);
          }

          if (appContainer) {
            appContainer.classList.add('shake-hard');
            setTimeout(() => appContainer.classList.remove('shake-hard'), 420);
          }
          if (damageFilter) {
            damageFilter.style.opacity = Math.min(1, totalDamage / 300);
          }
          if (sceneBg) {
            sceneBg.style.filter = `sepia(${totalDamage/6}%) contrast(${100 + totalDamage/4}%)`;
          }
        }, 430);
      }

      const pct = Math.min(Math.round((totalDamage / 675) * 100), 100);
      damageBar.style.width = `${pct}%`;
      damageText.textContent = `Урон: ${pct}%`;
      if (pct > 40) damageBar.className = 'h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      if (pct > 70) damageBar.className = 'h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]';

      if (currentIndex + 1 < crashQuestions.length) {
        renderQuestion(currentIndex + 1);
      } else {
        renderResultScreen(pct);
      }
    }

    function renderResultScreen(pct) {
      stepTitle.textContent = "Краш-тест завершен!";
      let statusText = "🛡️ Ваша бухгалтерия выдержала проверки!";
      if (pct > 35) statusText = "⚠️ Серьезные вмятины и риск налоговых претензий";
      if (pct > 65) statusText = "🚨 Бизнес в критической зоне риска!";

      cardContainer.innerHTML = `
        <div class="fade-in space-y-4 pt-1 text-center">
          <div class="p-4 bg-[#151617] border border-[#354251] rounded-2xl shadow-inner space-y-2">
            <div class="text-xs sm:text-sm font-medium text-[#999999]">${statusText}</div>
            <div id="final-loss-counter" class="font-serif text-3xl sm:text-4xl font-bold text-[#F4EBBE]">0 ₽</div>
            <div class="text-xs text-[#999999]">расчетные скрытые потери в год</div>
          </div>
          <button id="btn-fix-car" class="iksweb btn-pulse w-full text-center py-4 px-6 text-base sm:text-lg flex items-center justify-center gap-2">
            Получить экспресс аудит бесплатно →
          </button>
        </div>
      `;

      const estimatedLoss = Math.round(350000 + (totalDamage * 1200));
      _countUpAnimation('final-loss-counter', estimatedLoss);

      document.getElementById('btn-fix-car').addEventListener('click', () => {
        hapticImpact('heavy');
        if (onOpenDrawer) onOpenDrawer();
      });
    }

    function _countUpAnimation(targetId, endVal) {
      const el = document.getElementById(targetId);
      if (!el) return;
      let startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 1200, 1);
        const curr = Math.floor(progress * endVal);
        el.textContent = formatPrice(curr);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    renderStartScreen();
    initIcons();
  }

  // ── 5. Drawer ──────────────────────────────────────────
  function renderDetailDrawer() {
    return `
      <div id="drawer-container" class="fixed inset-0 z-50 invisible transition-all duration-300">
        <div id="drawer-backdrop" class="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
        <div id="drawer-panel" class="absolute bottom-0 left-0 right-0 max-w-xl mx-auto bg-[#1E2021] text-white rounded-t-3xl border-t border-[#354251] p-5 sm:p-6 shadow-2xl translate-y-full transition-all duration-300 flex flex-col max-h-[85vh] max-h-[85dvh]">
          <div class="w-12 h-1.5 bg-[#5F5F5F] rounded-full mx-auto mb-3 cursor-pointer shrink-0"></div>
          <button id="drawer-close" aria-label="Закрыть" class="absolute top-4 right-4 p-2 rounded-full hover:bg-[#282a2c] text-[#999999] transition-colors z-10">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <div id="drawer-scroll-content" class="overflow-y-auto pr-1 flex-1 transition-all duration-200" style="-webkit-overflow-scrolling: touch; overscroll-behavior: contain;">
            <div id="drawer-badge" class="inline-block px-3 py-1 bg-[#CACC90]/15 border border-[#CACC90]/30 text-[#CACC90] text-xs font-semibold rounded-full mb-2 transition-all">
              🛡️ 10 000 000 ₽ Финансовая ответственность
            </div>
            <h3 class="font-serif text-xl font-normal mb-2 text-white">
              Бесплатный экспресс аудит <span class="italic text-[#F4EBBE]">вашей бухгалтерской базы</span>
            </h3>
            <p id="drawer-desc" class="text-[#999999] text-sm mb-4 leading-relaxed transition-all">
              Заполните форму, и наш эксперт свяжется с вами в течение рабочего дня, проверит базу 1С и подготовит индивидуальное КП.
            </p>

            <form id="booking-form" class="space-y-3">
              <div>
                <label for="user-name" class="block text-xs text-[#999999] mb-1">Ваше имя <span class="text-red-400">*</span></label>
                <input type="text" id="user-name" name="name" autocomplete="name" enterkeyhint="next" required placeholder="Алексей" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm" />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label for="user-phone" class="block text-xs text-[#999999]">Телефон для связи с Вами <span class="text-red-400">*</span></label>
                  <span class="text-[10px] text-[#999999]">Формат: +7 ХХХХХХХХХХ (11 цифр)</span>
                </div>
                <input type="tel" id="user-phone" name="phone" inputmode="tel" autocomplete="tel" enterkeyhint="next" required placeholder="+7 (999) 000-00-00" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm transition-colors" />
              </div>

              <div>
                <label for="user-email" class="block text-xs text-[#999999] mb-1">E-mail, на случай если не дозвонимся <span class="text-red-400">*</span></label>
                <input type="email" id="user-email" name="email" autocomplete="email" enterkeyhint="next" required placeholder="name@domain.ru" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm" />
              </div>

              <div>
                <label for="user-datetime" class="block text-xs text-[#999999] mb-1">Удобная дата для консультации <span class="text-slate-500">(необязательно)</span></label>
                <input type="datetime-local" id="user-datetime" name="datetime" enterkeyhint="done" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm text-slate-300" />
              </div>

              <div id="drawer-error-box" class="hidden p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs leading-relaxed"></div>

              <button type="submit" id="drawer-submit-btn" class="iksweb w-full py-4 text-center justify-center font-bold text-base mt-2">
                Получить экспресс аудит →
              </button>
            </form>

            <div id="drawer-success-box" class="hidden text-center py-6 space-y-3">
              <div class="w-12 h-12 rounded-full bg-[#CACC90]/20 text-[#CACC90] flex items-center justify-center mx-auto">
                <i data-lucide="check-circle" class="w-6 h-6"></i>
              </div>
              <h4 class="font-serif text-lg font-bold text-white">Заявка принята!</h4>
              <div class="text-xs text-[#999999] leading-relaxed max-w-sm mx-auto space-y-2">
                <p>Благодарим Вас за обращение!<br/>Мы скоро свяжемся с Вами. В случае связи по телефону, мы будем звонить с номеров:</p>
                <div class="font-semibold text-[#F4EBBE] text-sm bg-[#151617] py-2 px-3 rounded-xl border border-[#354251] inline-block">
                  8 (800) 600-25-06 &nbsp;или&nbsp; +7 (343) 386-20-00
                </div>
                <p class="text-[11px] text-slate-400">Можете добавить их в свою книгу контактов под именем «Финэксперт-Екатеринбург»</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setupDrawerBehavior(containerEl) {
    const backdrop = containerEl.querySelector('#drawer-backdrop');
    const closeBtn = containerEl.querySelector('#drawer-close');
    const form = containerEl.querySelector('#booking-form');
    const errorBox = containerEl.querySelector('#drawer-error-box');
    const successBox = containerEl.querySelector('#drawer-success-box');
    const phoneInput = containerEl.querySelector('#user-phone');
    const emailInput = containerEl.querySelector('#user-email');
    const scrollContent = containerEl.querySelector('#drawer-scroll-content') || containerEl.querySelector('.overflow-y-auto');
    const drawerPanel = containerEl.querySelector('#drawer-panel');
    const drawerBadge = containerEl.querySelector('#drawer-badge');
    const drawerDesc = containerEl.querySelector('#drawer-desc');

    const openDrawer = () => {
      containerEl.classList.add('drawer-visible');
      hapticImpact('medium');
      if (scrollContent) scrollContent.scrollTop = 0;

      // Предзаполнение данных из Notibot
      const user = getState()?.user;
      if (user) {
        const nameInput = containerEl.querySelector('#user-name');
        if (nameInput && !nameInput.value) {
          nameInput.value = user.displayName || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || '';
        }
        if (phoneInput && !phoneInput.value && (user.phone || user.phone_number)) {
          phoneInput.value = user.phone || user.phone_number;
          phoneInput.dispatchEvent(new Event('input'));
        }
        if (emailInput && !emailInput.value && user.email) {
          emailInput.value = user.email;
        }
      }
    };

    const closeDrawer = () => {
      containerEl.classList.remove('drawer-visible', 'keyboard-active');
      if (drawerPanel) {
        drawerPanel.style.bottom = '';
        drawerPanel.style.maxHeight = '';
      }
      if (drawerBadge) drawerBadge.style.display = '';
      if (drawerDesc) drawerDesc.style.display = '';
      if (scrollContent) scrollContent.style.paddingBottom = '';
      hapticSelection();
    };

    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const enableCompactKeyboardMode = () => {
      containerEl.classList.add('keyboard-active');
      if (drawerBadge) drawerBadge.style.display = 'none';
      if (drawerDesc) drawerDesc.style.display = 'none';
    };

    const disableCompactKeyboardMode = () => {
      containerEl.classList.remove('keyboard-active');
      if (drawerBadge) drawerBadge.style.display = '';
      if (drawerDesc) drawerDesc.style.display = '';
    };

    // 📱 Адаптация под фокус полей ввода
    const formInputs = form ? form.querySelectorAll('input') : [];
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        enableCompactKeyboardMode();
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      });

      input.addEventListener('blur', () => {
        setTimeout(() => {
          const active = document.activeElement;
          if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'BUTTON')) {
            disableCompactKeyboardMode();
            if (drawerPanel) {
              drawerPanel.style.bottom = '';
              drawerPanel.style.maxHeight = '';
            }
          }
        }, 200);
      });
    });

    // 📱 Подъем шторки НАД клавиатурой (VisualViewport)
    if (window.visualViewport) {
      const handleViewportChange = () => {
        if (!containerEl.classList.contains('drawer-visible')) return;
        const vv = window.visualViewport;
        const winHeight = window.innerHeight;
        const kbdHeight = Math.max(0, winHeight - vv.height - vv.offsetTop);

        if (kbdHeight > 100 || (document.activeElement && document.activeElement.tagName === 'INPUT')) {
          enableCompactKeyboardMode();
          if (drawerPanel) {
            const safeBottom = Math.max(kbdHeight, 0);
            drawerPanel.style.bottom = `${safeBottom}px`;
            drawerPanel.style.maxHeight = `${Math.max(220, vv.height - 12)}px`;
          }
          const activeInput = document.activeElement;
          if (activeInput && activeInput.tagName === 'INPUT') {
            activeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          if (document.activeElement?.tagName !== 'INPUT') {
            disableCompactKeyboardMode();
            if (drawerPanel) {
              drawerPanel.style.bottom = '';
              drawerPanel.style.maxHeight = '';
            }
          }
        }
      };

      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    // 📞 Маска и форматирование телефона на лету
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let inputVal = e.target.value;
        let digits = inputVal.replace(/\D/g, '');

        if (digits.startsWith('8')) {
          digits = '7' + digits.slice(1);
        } else if (digits.length > 0 && !digits.startsWith('7')) {
          digits = '7' + digits;
        }

        digits = digits.slice(0, 11);

        let formatted = '';
        if (digits.length > 0) {
          formatted = '+7';
          if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4);
          }
          if (digits.length >= 4) {
            formatted += ') ' + digits.slice(4, 7);
          }
          if (digits.length >= 7) {
            formatted += '-' + digits.slice(7, 9);
          }
          if (digits.length >= 9) {
            formatted += '-' + digits.slice(9, 11);
          }
        }

        e.target.value = formatted;
        if (errorBox) errorBox.classList.add('hidden');
        phoneInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500/50');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name')?.value?.trim();
        const phoneInputVal = phoneInput ? phoneInput.value : '';
        const digits = phoneInputVal.replace(/\D/g, '');
        const email = document.getElementById('user-email')?.value?.trim();
        const datetime = document.getElementById('user-datetime')?.value?.trim();

        // 🔒 Валидация телефона (11 цифр)
        if (digits.length !== 11 || !digits.startsWith('7')) {
          if (errorBox) {
            errorBox.classList.remove('hidden');
            errorBox.textContent = `⚠️ Ошибка номера: Введите ровно 11 цифр в формате +7 ХХХХХХХХХХ (введено: ${digits.length}).`;
          }
          if (phoneInput) {
            phoneInput.classList.add('border-red-500', 'ring-2', 'ring-red-500/50');
            phoneInput.focus();
          }
          hapticImpact('heavy');
          return;
        }

        // 🔒 Валидация Email
        if (!email || !email.includes('@')) {
          if (errorBox) {
            errorBox.classList.remove('hidden');
            errorBox.textContent = '⚠️ Ошибка ввода: Укажите корректный E-mail адрес.';
          }
          const emailEl = document.getElementById('user-email');
          if (emailEl) emailEl.focus();
          hapticImpact('heavy');
          return;
        }

        errorBox.classList.add('hidden');

        // 🔥 Ответы строго по схеме form_lead_int.json (formId: "3ssRZEmG4YSsgDGlL0KV3O")
        const FORM_ID = "3ssRZEmG4YSsgDGlL0KV3O";
        const answers = [
          { title: "Ваше имя", answers: name ? [name] : [] },
          { title: "Телефон для связи с Вами", answers: phoneInputVal ? [phoneInputVal] : [] },
          { title: "E-mail, на случай если не дозвонимся", answers: email ? [email] : [] },
          { title: "Удобная дата для консультации", answers: datetime ? [datetime] : [] }
        ];

        try {
          await submitForm(FORM_ID, answers);
          form.classList.add('hidden');
          successBox.classList.remove('hidden');
          disableCompactKeyboardMode();
          if (drawerPanel) {
            drawerPanel.style.bottom = '';
            drawerPanel.style.maxHeight = '';
          }
          hapticImpact('heavy');
        } catch (error) {
          errorBox.classList.remove('hidden');
          if (error instanceof window.NotibotBridgeError || error?.name === 'NotibotBridgeError' || error?.code) {
            if (error.code === 'ERR_RATE_LIMIT') {
              errorBox.textContent = "Слишком частые запросы. Пожалуйста, подождите 10 секунд.";
            } else if (error.code === 'ERR_VALIDATION_FAILED') {
              errorBox.textContent = `Ошибка валидации: ${error.message}`;
            } else if (error.code === 'ERR_INVALID_PAYLOAD') {
              errorBox.textContent = `Ошибка формата данных: ${error.message}`;
            } else {
              errorBox.textContent = `Ошибка Notibot Bridge [${error.code || 'ERR_UNKNOWN'}]: ${error.message || 'Не удалось отправить форму'}`;
            }
          } else {
            errorBox.textContent = `Ошибка отправки: ${error?.message || 'Неизвестная ошибка'}`;
          }
          hapticImpact('heavy');
        }
      });
    }

    initIcons();
    return { open: openDrawer, close: closeDrawer };
  }

  // ── 6. Главная точка входа ──────────────────────────────
  function initApp(state) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.opacity = '0';
      setTimeout(() => { loadingEl.style.display = 'none'; }, 300);
    }

    const appEl = document.getElementById('app');
    if (!appEl) return;

    appEl.innerHTML = `
      <main class="max-w-xl mx-auto px-4 py-6 safe-top safe-bottom fade-in space-y-6">
        <header class="text-center space-y-1 mb-2">
          <div class="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
            🔥 Экспресс-Аудит Бухгалтерии 2026
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Краш-Тест Бухгалтерии</h1>
          <p style="color: var(--color-muted)" class="text-xs">
            Проверьте готовность компании к ФНС, 115-ФЗ и реформе НДС
          </p>
        </header>

        ${renderCrashTestQuiz(state)}
        ${renderDetailDrawer()}
      </main>
    `;

    const drawer = setupDrawerBehavior(document.getElementById('drawer-container'));
    initCrashTestQuiz(() => drawer.open());
    initIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initBridge(initApp));
  } else {
    initBridge(initApp);
  }
})();
