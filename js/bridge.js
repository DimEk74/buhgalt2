// js/bridge.js
// Все обращения к window.notibot — только отсюда.

let _state = { user: null, app: null, colors: null };
const _listeners = [];

/**
 * Инициализация Notibot Bridge с поддержкой фоллбэка.
 * @param {Function} onReady — коллбэк { user, app, colors }
 */
export function initBridge(onReady) {
  let isReady = false;

  const handleReady = (user, app) => {
    if (isReady) return;
    isReady = true;
    _state = { user: user || {}, app: app || {}, colors: app?.colors };
    _applyTheme(_state.colors);

    if (onReady) {
      onReady(_state);
    }
    _listeners.forEach(fn => fn(_state));
  };

  if (window.notibot && typeof window.notibot.onUpdate === 'function') {
    window.notibot.onUpdate((user, app) => {
      handleReady(user, app);
    });
  }

  // Фоллбэк: если запуск происходит вне Notibot (автономный браузер)
  setTimeout(() => {
    handleReady(_state.user, _state.app);
  }, 120);
}

/** Подписаться на обновления моста */
export function onStateUpdate(fn) {
  if (typeof fn === 'function') {
    _listeners.push(fn);
    if (_state.user?.id || _state.user?.displayName || _state.user?.first_name) {
      fn(_state);
    }
  }
}

/** Текущее состояние моста */
export function getState() {
  return _state;
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

/**
 * Отправить форму с обработкой таймаута в 10 секунд и NotibotBridgeError
 * @param {string} formId — ID формы из схемы (form_lead_int.json: "3ssRZEmG4YSsgDGlL0KV3O")
 * @param {Array} answers — массив ответов [{title: string, answers: string[]}]
 */
export async function submitForm(formId, answers) {
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
  if (colors.background) document.body.style.backgroundColor = colors.background;
  if (colors.textPrimary) document.body.style.color = colors.textPrimary;
}

