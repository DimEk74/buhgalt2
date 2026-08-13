// js/components/detail-drawer.js
// Всплывашка (Bottom Sheet) для формы записи на экспресс-аудит (Finexpert style).

import { initIcons, escapeHtml } from '../utils.js';
import { hapticImpact, hapticSelection, submitForm } from '../bridge.js';

export function renderDetailDrawer() {
  return `
    <div id="drawer-container" class="fixed inset-0 z-50 invisible transition-all duration-300">
      <div id="drawer-backdrop" class="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
      <div id="drawer-panel" class="absolute bottom-0 left-0 right-0 max-w-xl mx-auto bg-[#1E2021] text-white rounded-t-3xl border-t border-[#354251] p-6 shadow-2xl translate-y-full transition-transform duration-300 flex flex-col max-h-[90vh]">
        <div class="w-12 h-1.5 bg-[#5F5F5F] rounded-full mx-auto mb-4 cursor-pointer"></div>
        <button id="drawer-close" class="absolute top-4 right-4 p-2 rounded-full hover:bg-[#282a2c] text-[#999999] transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="overflow-y-auto pr-1 flex-1">
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
              <label class="block text-xs text-[#999999] mb-1">Ваше имя</label>
              <input type="text" id="user-name" required placeholder="Алексей" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm" />
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs text-[#999999]">Телефон</label>
                <span class="text-[10px] text-[#999999]">Формат: +7 ХХХХХХХХХХ (11 цифр)</span>
              </div>
              <input type="tel" id="user-phone" required placeholder="+7 (999) 000-00-00" class="w-full px-4 py-3 bg-[#151617] border border-[#354251] rounded-xl text-white focus:outline-none focus:border-[#CACC90] text-sm transition-colors" />
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

export function setupDrawerBehavior(containerEl) {
  const backdrop = containerEl.querySelector('#drawer-backdrop');
  const closeBtn = containerEl.querySelector('#drawer-close');
  const form = containerEl.querySelector('#booking-form');
  const errorBox = containerEl.querySelector('#drawer-error-box');
  const successBox = containerEl.querySelector('#drawer-success-box');
  const phoneInput = containerEl.querySelector('#user-phone');

  const openDrawer = () => {
    containerEl.classList.add('drawer-visible');
    document.body.style.overflow = 'hidden';
    hapticImpact('medium');
  };

  const closeDrawer = () => {
    containerEl.classList.remove('drawer-visible');
    document.body.style.overflow = '';
    hapticSelection();
  };

  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

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
          errorBox.innerHTML = `⚠️ <b>Ошибка ввода номера:</b> Введите ровно 11 цифр в формате <b>+7 ХХХХХХХХХХ</b>. Currently entered: ${digits.length} digits.`;
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
