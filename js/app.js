// js/app.js
// Главная точка входа приложения.

import { initIcons } from './utils.js';
import { initBridge } from './bridge.js';
import { renderCrashTestQuiz, initCrashTestQuiz } from './components/crash-test-quiz.js';
import { renderDetailDrawer, setupDrawerBehavior } from './components/detail-drawer.js';

/**
 * Инициализация приложения.
 */
function initApp() {
  const appEl = document.getElementById('app');

  // Монтируем компоненты в DOM
  appEl.innerHTML = `
    <main class="max-w-xl mx-auto px-4 py-6 safe-top safe-bottom fade-in space-y-6">
      <!-- Заголовок приложения -->
      <header class="text-center space-y-1 mb-2">
        <div class="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
          🔥 Экспресс-Аудит Бухгалтерии 2026
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Краш-Тест Бухгалтерии</h1>
        <p style="color: var(--color-muted)" class="text-xs">
          Проверьте готовность системы к ФНС, 115-ФЗ и реформе НДС за 60 секунд
        </p>
      </header>

      <!-- Интерактивный Квиз -->
      ${renderCrashTestQuiz()}

      <!-- Всплывашка Drawer -->
      ${renderDetailDrawer()}
    </main>
  `;

  // Подключаем поведение
  const drawer = setupDrawerBehavior(document.getElementById('drawer-container'));
  initCrashTestQuiz(() => drawer.open());

  initIcons();
}

// Запуск после инициализации Notibot Bridge
initBridge(() => {
  initApp();
});

