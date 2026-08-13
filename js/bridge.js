// js/bridge.js
// Все обращения к window.notibot — только отсюда.

let _state = { user: null, app: null, colors: null };
const _listeners = [];

/**
 * Инициализация Notibot Bridge с фоллбэком для автономного запуска в браузере.
 * @param {Function} onReady
 */
export function initBridge(onReady) {
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
    window.notibot.onUpdate((user, app) => {
      handleReady(user, app);
    });
  }

  // Фоллбэк: если запуск происходит в обычном браузере (не внутри Notibot)
  setTimeout(() => {
    handleReady(_state.user, _state.app);
  }, 100);
}

/** Виброотклик средней тяжести */
export function hapticImpact(style = 'medium') {
  if (window.notibot?.hapticImpact) {
    window.notibot.hapticImpact(style);
  }
}

/** Виброотклик выбора */
export function hapticSelection() {
  if (window.notibot?.hapticSelection) {
    window.notibot.hapticSelection();
  }
}

/** Отправка формы */
export async function submitForm(formId, answers) {
  if (window.notibot?.submitForm) {
    return window.notibot.submitForm(formId, answers);
  }
  console.log("Mock submitForm:", formId, answers);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
}

function _applyTheme(colors) {
  if (!colors) return;
  const r = document.documentElement;
  if (colors.background) r.style.setProperty('--color-bg', colors.background);
  if (colors.textPrimary) r.style.setProperty('--color-text', colors.textPrimary);
  if (colors.primaryMain) r.style.setProperty('--color-accent', colors.primaryMain);
}
