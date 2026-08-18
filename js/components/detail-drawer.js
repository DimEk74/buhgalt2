// js/components/detail-drawer.js
// Всплывашка (Bottom Sheet) для формы записи на экспресс-аудит (Finexpert style).
// Полное соответствие схеме form_lead_int.json (formId: "3ssRZEmG4YSsgDGlL0KV3O")

import { initIcons, escapeHtml } from '../utils.js';
import { hapticImpact, hapticSelection, submitForm, getState } from '../bridge.js';

export function renderDetailDrawer() {
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

export function setupDrawerBehavior(containerEl) {
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
        // Безопасная обработка NotibotBridgeError с выводом через textContent (для защиты от XSS)
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


