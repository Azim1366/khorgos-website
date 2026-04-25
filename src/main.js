// ==================== АНИМАЦИЯ ЦИФР ПРИ ЗАГРУЗКЕ ====================

const valueElements = document.querySelectorAll('.numbers__value');

const targets = [
  { value: 5.6, suffix: ' км²', decimals: 1 },
  { value: 5000, suffix: '', decimals: 0 },
  { value: 1200, suffix: '+', decimals: 0 },
  { value: 15, suffix: ' млрд', decimals: 0 }
];

const duration = 3600;
const interval = 20;
const steps = duration / interval;

function animateNumbers() {
  valueElements.forEach(function (element, index) {
    const target = targets[index];
    if (!target) return;

    const startValue = 0;
    const totalChange = target.value - startValue;
    let currentStep = 0;

    const timer = setInterval(function () {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + totalChange * easedProgress;

      let displayValue;
      if (target.decimals > 0) {
        displayValue = currentValue.toFixed(target.decimals);
      } else {
        displayValue = Math.floor(currentValue);
      }

      element.textContent = displayValue + target.suffix;

      if (currentStep >= steps) {
        clearInterval(timer);
        let finalValue;
        if (target.decimals > 0) {
          finalValue = target.value.toFixed(target.decimals);
        } else {
          finalValue = target.value;
        }
        element.textContent = finalValue + target.suffix;
      }
    }, interval);
  });
}

animateNumbers();

// ==================== АНИМАЦИЯ ПРОГРЕСС-БАРА ЗАПОЛНЯЕМОСТИ ====================

const meterSection = document.getElementById('invest');
const occupancyValue = document.getElementById('occupancyValue');
const occupancyFill = document.getElementById('occupancyFill');

const targetPercent = 82;
let animated = false;

function animateMeter() {
  if (animated || !meterSection) return;

  const sectionTop = meterSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (sectionTop < windowHeight - 100) {
    animated = true;

    let current = 0;
    const step = targetPercent / 120;

    const timer = setInterval(function () {
      current += step;
      if (current >= targetPercent) {
        current = targetPercent;
        clearInterval(timer);
      }
      occupancyValue.textContent = Math.round(current) + '%';
      occupancyFill.style.width = current + '%';
    }, 16);
  }
}

window.addEventListener('scroll', animateMeter);

// ==================== КАРТА МЦПС «ХОРГОС» ====================
const mapElement = document.getElementById('map');

if (mapElement) {

  // Точные координаты: 44°14'21.7"N 80°21'04.0"E
  const khorgosLat = 44.239361;
  const khorgosLng = 80.351111;

  const map = L.map('map').setView([khorgosLat, khorgosLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker([khorgosLat, khorgosLng], { icon: redIcon })
    .addTo(map)
    .bindPopup('<strong>МЦПС «Хоргос»</strong><br>Казахстан — Китай')
    .openPopup();

  // Линия границы
  const borderLine = [
    [44.255, 80.340],
    [44.255, 80.370],
  ];
  L.polyline(borderLine, {
    color: '#C9A84C',
    weight: 3,
    dashArray: '8, 8',
  }).addTo(map);

  // Подпись KAZAKHSTAN
  L.marker([44.265, 80.351], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:rgba(10,22,40,0.85);color:#FFF;padding:6px 14px;border-radius:4px;font-family:Tenor Sans,serif;font-size:14px;letter-spacing:1px;white-space:nowrap;">KAZAKHSTAN</div>',
      iconSize: [0, 0],
      iconAnchor: [70, 8],
    })
  }).addTo(map);

  // Подпись CHINA
  L.marker([44.220, 80.351], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:rgba(10,22,40,0.85);color:#C9A84C;padding:6px 14px;border-radius:4px;font-family:Tenor Sans,serif;font-size:14px;letter-spacing:1px;white-space:nowrap;">CHINA</div>',
      iconSize: [0, 0],
      iconAnchor: [50, 20],
    })
  }).addTo(map);

}

// ==================== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ ====================

const langButtons = document.querySelectorAll('.lang-btn');

// Загружаем сохранённый язык или берём русский по умолчанию
let currentLang = localStorage.getItem('lang') || 'ru';

// Функция: обновляет все элементы с переводами
function applyLanguage(lang) {
  // Обновляем все элементы, у которых есть data-атрибуты языка
  const elements = document.querySelectorAll('[data-ru]');
  
  elements.forEach(function (el) {
    const translation = el.getAttribute('data-' + lang);
    if (translation) {
      el.innerHTML = translation;
    }
  });

  // Обновляем активную кнопку
  langButtons.forEach(function (btn) {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });

  // Сохраняем выбор
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

// Вешаем обработчики на кнопки
langButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const lang = btn.getAttribute('data-lang');
    applyLanguage(lang);
  });
});

// Применяем язык при загрузке страницы
applyLanguage(currentLang);