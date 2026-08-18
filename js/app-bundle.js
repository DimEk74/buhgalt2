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
      if (onReady) onReady(_state);
      _listeners.forEach(fn => fn(_state));
    };

    if (window.notibot && typeof window.notibot.onUpdate === 'function') {
      window.notibot.onUpdate((user, app) => handleReady(user, app));
    }
    setTimeout(() => handleReady(_state.user, _state.app), 100);
  }

  function hapticImpact(style = 'medium') {
    if (window.notibot?.hapticImpact) window.notibot.hapticImpact(style);
  }

  function hapticSelection() {
    if (window.notibot?.hapticSelection) window.notibot.hapticSelection();
  }

  async function submitForm(formId, answers) {
    if (window.notibot?.submitForm) return window.notibot.submitForm(formId, answers);
    console.log("Mock submitForm:", formId, answers);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
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
  function renderCrashTestQuiz() {
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

          <!-- Contacts -->
          <div class="hidden sm:flex items-center gap-4 text-xs text-[#999999]">
            <div class="flex flex-col text-right">
              <a href="tel:88006002506" class="text-white font-semibold hover:text-[#CACC90] transition-colors">8 (800) 600-25-06</a>
              <span>Екатеринбург, Горького 65</span>
            </div>
            <button type="button" onclick="document.getElementById('btn-fix-car')?.click() || window.open('https://finexpert-e.ru', '_blank')" class="px-3.5 py-1.5 bg-[#CACC90] text-[#151617] text-xs font-semibold rounded-full hover:bg-[#F4EBBE] transition-colors">
              Консультация
            </button>
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

          <!-- 3D Крупный векторный Камень (SVG) Слева Сверху -->
          <img id="strike-pebble" src="./img/rock.svg" alt="Камень" class="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 z-30 opacity-0 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]" />
          <div id="spark-effect" class="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#F4EBBE] rounded-full blur-lg z-30 opacity-0 pointer-events-none mix-blend-screen"></div>
          <div id="shatter-glass" class="absolute top-10 left-1/2 w-12 h-12 bg-white/40 backdrop-blur border border-white/80 rounded z-20 opacity-0 pointer-events-none"></div>

          <!-- КРУПНЫЕ ЯРКИЕ ОТЛЕТАЮЩИЕ ДЕТАЛИ КУЗОВА (Ultra-Visible SVG Car Parts) -->
          <!-- 1. Колесо / Диск -->
          <svg id="car-part-wheel" class="absolute top-12 left-1/2 w-16 h-16 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#e2e8f0" stroke-width="8"/>
            <circle cx="50" cy="50" r="30" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
            <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="#f1f5f9" stroke-width="6" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
          </svg>

          <!-- 2. Дверь / Элемент кузова -->
          <svg id="car-part-door" class="absolute top-14 left-1/2 w-24 h-16 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" viewBox="0 0 120 80">
            <path d="M10 20 Q 30 5, 110 10 L 100 70 Q 40 75, 10 60 Z" fill="url(#redGrad2)" stroke="#ffffff" stroke-width="3"/>
            <rect x="30" y="15" width="40" height="20" rx="3" fill="#38bdf8" opacity="0.8" stroke="#ffffff" stroke-width="2"/>
            <rect x="75" y="45" width="20" height="6" rx="3" fill="#e2e8f0"/>
            <defs>
              <linearGradient id="redGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#dc2626"/>
                <stop offset="50%" stop-color="#ef4444"/>
                <stop offset="100%" stop-color="#991b1b"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- 3. Светящаяся Фара -->
          <svg id="car-part-headlight" class="absolute top-16 left-1/2 w-20 h-14 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_20px_rgba(56,189,248,1)]" viewBox="0 0 100 70">
            <path d="M10 10 Q 80 5, 90 40 Q 60 65, 10 50 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
            <circle cx="45" cy="32" r="18" fill="#fef08a" stroke="#ffffff" stroke-width="3"/>
            <circle cx="75" cy="35" r="10" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
          </svg>

          <!-- 4. Бампер / Спойлер -->
          <svg id="car-part-bumper" class="absolute top-16 left-1/2 w-24 h-12 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]" viewBox="0 0 120 60">
            <path d="M5 40 Q 60 5, 115 40 L 105 55 Q 60 25, 15 55 Z" fill="#1e293b" stroke="#f59e0b" stroke-width="4"/>
            <rect x="35" y="30" width="50" height="10" fill="#f59e0b" rx="2"/>
          </svg>

          <!-- 5. Осколок Лобового Стекла -->
          <svg id="car-part-glass" class="absolute top-10 left-1/2 w-20 h-20 z-40 opacity-0 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,1)]" viewBox="0 0 100 100">
            <polygon points="20,10 50,40 10,70" fill="rgba(255,255,255,0.95)" stroke="#ffffff" stroke-width="2"/>
            <polygon points="60,15 90,50 45,60" fill="rgba(186,230,253,0.95)" stroke="#ffffff" stroke-width="2"/>
            <polygon points="30,55 75,90 15,95" fill="rgba(224,242,254,0.9)" stroke="#38bdf8" stroke-width="2"/>
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
        const spark = document.getElementById('spark-effect');
        const shatter = document.getElementById('shatter-glass');

        const partWheel = document.getElementById('car-part-wheel');
        const partDoor = document.getElementById('car-part-door');
        const partHeadlight = document.getElementById('car-part-headlight');
        const partBumper = document.getElementById('car-part-bumper');
        const partGlass = document.getElementById('car-part-glass');

        if (pebble) {
          pebble.classList.remove('pebble-anim');
          void pebble.offsetWidth;
          pebble.classList.add('pebble-anim');
        }

        setTimeout(() => {
          if (spark) {
            spark.classList.remove('spark-flash');
            void spark.offsetWidth;
            spark.classList.add('spark-flash');
          }
          if (shatter) {
            shatter.classList.remove('shatter-anim');
            void shatter.offsetWidth;
            shatter.classList.add('shatter-anim');
          }

          // Отлетает ровно ОДНА деталь за прилет
          const partsList = [
            { el: partWheel, anim: 'fly-wheel' },
            { el: partDoor, anim: 'fly-door' },
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
            setTimeout(() => appContainer.classList.remove('shake-hard'), 400);
          }
          if (damageFilter) {
            damageFilter.style.opacity = Math.min(1, totalDamage / 300);
          }
          if (sceneBg) {
            sceneBg.style.filter = `sepia(${totalDamage/6}%) contrast(${100 + totalDamage/4}%)`;
          }
        }, 450);
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
            <div class="inline-block px-3 py-1 bg-[#CACC90]/15 border border-[#CACC90]/30 text-[#CACC90] text-xs font-semibold rounded-full mb-2">
              🛡️ 10 000 000 ₽ Финансовая ответственность
            </div>
            <h3 class="font-serif text-xl font-normal mb-2 text-white">
              Бесплатный экспресс аудит <span class="italic text-[#F4EBBE]">вашей бухгалтерской базы</span>
            </h3>
            <p class="text-[#999999] text-sm mb-4 leading-relaxed">
              Оставьте свой номер телефона. Наш эксперт свяжется с вами в течение рабочего дня, проверит базу 1С и подготовит индивидуальное КП под ваш бизнес.
            </p>

            <form id="booking-form" class="space-y-3">
              <div>
                <label for="user-name" class="block text-xs text-[#999999] mb-1">Ваше имя</label>
                <input type="text" id="user-name" name="name" autocomplete="name" enterkeyhint="next" required placeholder="Алексей" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm" />
              </div>
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label for="user-phone" class="block text-xs text-[#999999]">Телефон</label>
                  <span class="text-[10px] text-[#999999]">Формат: +7 ХХХХХХХХХХ (11 цифр)</span>
                </div>
                <input type="tel" id="user-phone" name="phone" inputmode="tel" autocomplete="tel" enterkeyhint="done" required placeholder="+7 (999) 000-00-00" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm transition-colors" />
              </div>

              <div id="drawer-error-box" class="hidden p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs"></div>

              <button type="submit" id="drawer-submit-btn" class="iksweb w-full py-4 text-center justify-center font-bold text-base mt-2">
                Получить экспресс аудит →
              </button>
            </form>

            <div id="drawer-success-box" class="hidden text-center py-6">
              <div class="w-12 h-12 rounded-full bg-[#CACC90]/20 text-[#CACC90] flex items-center justify-center mx-auto mb-3">
                <i data-lucide="check-circle" class="w-6 h-6"></i>
              </div>
              <h4 class="font-serif text-lg font-bold text-white mb-1">Заявка принята!</h4>
              <p class="text-xs text-[#999999]">Наш Главный бухгалтер свяжется с вами в ближайшее время.</p>
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
    const scrollContent = containerEl.querySelector('#drawer-scroll-content') || containerEl.querySelector('.overflow-y-auto');
    const drawerPanel = containerEl.querySelector('#drawer-panel');

    const openDrawer = () => {
      containerEl.classList.add('drawer-visible');
      hapticImpact('medium');
      if (scrollContent) scrollContent.scrollTop = 0;
    };

    const closeDrawer = () => {
      containerEl.classList.remove('drawer-visible');
      if (scrollContent) scrollContent.style.paddingBottom = '';
      if (drawerPanel) drawerPanel.style.maxHeight = '';
      hapticSelection();
    };

    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // 📱 Адаптация под мобильную клавиатуру (Scroll & Viewport)
    const formInputs = form ? form.querySelectorAll('input') : [];
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (scrollContent) {
          scrollContent.style.paddingBottom = '180px';
        }
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 250);
      });

      input.addEventListener('blur', () => {
        setTimeout(() => {
          const active = document.activeElement;
          if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'BUTTON')) {
            if (scrollContent) {
              scrollContent.style.paddingBottom = '';
            }
          }
        }, 200);
      });
    });

    if (window.visualViewport) {
      const handleViewportChange = () => {
        if (!containerEl.classList.contains('drawer-visible')) return;
        const vvHeight = window.visualViewport.height;
        const winHeight = window.innerHeight;

        if (winHeight - vvHeight > 100) {
          if (drawerPanel) {
            drawerPanel.style.maxHeight = `${Math.max(260, vvHeight - 16)}px`;
          }
          if (scrollContent) {
            scrollContent.style.paddingBottom = '160px';
          }
          const activeInput = document.activeElement;
          if (activeInput && activeInput.tagName === 'INPUT') {
            activeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          if (drawerPanel) drawerPanel.style.maxHeight = '';
          if (scrollContent && document.activeElement?.tagName !== 'INPUT') {
            scrollContent.style.paddingBottom = '';
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
        const name = document.getElementById('user-name')?.value;
        const phone = phoneInput ? phoneInput.value : '';
        const digits = phone.replace(/\D/g, '');

        // 🔒 Валидация длины номера: ровно 11 цифр (+7 ХХХХХХХХХХ)
        if (digits.length !== 11 || !digits.startsWith('7')) {
          if (errorBox) {
            errorBox.classList.remove('hidden');
            errorBox.innerHTML = `⚠️ <b>Ошибка номера:</b> Номер должен содержать ровно 11 цифр в формате <b>+7 ХХХХХХХХХХ</b> (введено: ${digits.length}).`;
          }
          if (phoneInput) {
            phoneInput.classList.add('border-red-500', 'ring-2', 'ring-red-500/50');
            phoneInput.focus();
          }
          hapticImpact('heavy');
          return;
        }

        errorBox.classList.add('hidden');
        try {
          await submitForm("crash_test_booking", [
            { title: "Имя", answers: name ? [name] : [] },
            { title: "Телефон", answers: phone ? [phone] : [] }
          ]);
          form.classList.add('hidden');
          successBox.classList.remove('hidden');
          if (scrollContent) scrollContent.style.paddingBottom = '';
          hapticImpact('heavy');
        } catch (err) {
          errorBox.classList.remove('hidden');
          errorBox.textContent = escapeHtml(err?.message || "Ошибка отправки. Попробуйте еще раз.");
        }
      });
    }

    initIcons();
    return { open: openDrawer, close: closeDrawer };
  }

  // ── 6. Главная точка входа ──────────────────────────────
  function initApp() {
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

        ${renderCrashTestQuiz()}
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
