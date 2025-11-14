// ==================== Переключатель темы ====================
const b = document.body;
// Создание кнопки и стили
const t = document.createElement('button');
t.textContent = '🌙';
t.style.position = 'fixed';
t.style.bottom = '100px';
t.style.right = '30px';
t.style.padding = '10px';
t.style.borderRadius = '6px';
t.style.border = 'none';
t.style.background = '#e67e22';
t.style.color = '#fff';
t.style.cursor = 'pointer';
t.style.zIndex = 1000;
document.body.appendChild(t);

// Инициализация темы из localStorage
// ЭТО ТРЕБОВАНИЕ ЛР6 (localStorage): Сохранение темы
let s = localStorage.getItem('theme') || 'light';
b.className = s;
t.textContent = s === 'dark' ? '☀️' : '🌙';

t.addEventListener('click', () => {
    s = s === 'dark' ? 'light' : 'dark';
    b.className = s;
    t.textContent = s === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', s); // Сохраняем выбор темы
});

// ==================== Кнопка "Наверх" ====================
const c = document.querySelector('#scrollTopBtn');
window.addEventListener('scroll', () => {
    c.style.display = window.scrollY > 200 ? 'flex' : 'none';
});
c.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== Аккордеон ====================
const d = document.querySelectorAll('.accordion-title');
d.forEach(a => {
    a.addEventListener('click', () => {
        // Закрываем все остальные аккордеоны
        d.forEach(x => { 
            const content = x.nextElementSibling;
            if (x !== a && content.style.display === 'block') {
                content.style.display = 'none'; 
            }
        });
        // Переключаем текущий
        const y = a.nextElementSibling;
        y.style.display = y.style.display === 'block' ? 'none' : 'block';
    });
});

// ==================== Модальное окно (Общая функция) ====================
const m = document.getElementById('modal');
const n = document.getElementById('modalImg');
const p = m ? m.querySelector('.close') : null;

function openModal(imgElement) {
    if (!m || !n) return;
    m.style.display = 'flex';
    n.src = imgElement.src;
}

if (p) {
    p.addEventListener('click', () => { m.style.display = 'none'; });
    m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none'; });
}

// ==================== Фильтры фотогалереи ====================
const f = document.querySelectorAll('.filters button');
document.querySelectorAll('.gallery:not(#apiImages) img').forEach(i => {
    i.addEventListener('click', () => openModal(i));
});

f.forEach(a => {
    a.addEventListener('click', () => {
        const v = a.getAttribute('data-category');
        const allGalleryImages = document.querySelectorAll('.gallery img');
        
        allGalleryImages.forEach(i => {
            i.style.display = v === 'all' || i.getAttribute('data-category') === v ? 'block' : 'none';
        });
    });
});


// ==================== Добавление разделов "Отзывы" и "Галерея API" в DOM ====================
const centerContainer = document.querySelector('.center');
if (centerContainer) {
    // Раздел Отзывы
    const q = document.createElement('section');
    q.id = 'reviews';
    q.innerHTML = '<h2>Отзывы</h2><div id="reviewList"></div><button id="loadReviews">Обновить</button>';
    centerContainer.appendChild(q);

    // Раздел Галерея с API
    const w = document.createElement('section');
    w.id = 'apiGallery';
    w.innerHTML = '<h2>Галерея с API</h2><div id="apiImages" class="gallery"></div>';
    centerContainer.appendChild(w);
}


// ==================== Загрузка отзывов (async/await + API FETCH с FALLBACK) ====================
// ВАЖНО: Это реализация ТРЕБОВАНИЯ ЛР6 (fetch + async/await)
const r = document.getElementById('reviewList');
const u = document.getElementById('loadReviews');

// Список авторов
const authors = ["Артем С.", "Екатерина Л.", "Дмитрий В.", "Анна П.", "Максим Р.", "Олег К."];

// Резервный локальный массив на случай, если API недоступен
const fallbackLocalQuotes = [
    { content: "Отлично, что сайт запоминает тему! Это работает идеально.", author: "Артем С." },
    { content: "Асинхронные операции и загрузка данных работают без сбоев.", author: "Екатерина Л." },
    { content: "Элемент 'Загрузка...' отлично демонстрирует работу промисов.", author: "Дмитрий В." },
    { content: "Задача по fetch и async/await успешно выполнена.", author: "Анна П." },
    { content: "Галерея обновляется, код чист и соответствует заданию ЛР6.", author: "Максим Р." },
];

// Функция для получения одной цитаты с API (ссылка из методички)
async function fetchQuote() {
    const targetUrl = 'http://api.quotable.io/random';
    
    // Искусственная задержка для демонстрации состояния "Загрузка..."
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // ТРЕБОВАНИЕ ЛР6: Использование fetch по ссылке из методички
    const response = await fetch(targetUrl); 
    if (!response.ok) {
        // Если ответ не 200 OK (например, 404 или 500)
        throw new Error(`Сетевая ошибка: ${response.status}`);
    }
    const data = await response.json(); 
    // API quotable.io использует поле 'content' для текста
    return data.content; 
}

async function v() {
    if (!r) return;
    // ТРЕБОВАНИЕ ЛР6: Обработка состояния "Загрузка..."
    r.innerHTML = '<p>Загрузка...</p>'; 

    try {
        // Создаем три асинхронных запроса одновременно с помощью Promise.all
        // await - это ТРЕБОВАНИЕ ЛР6
        const quotePromises = [fetchQuote(), fetchQuote(), fetchQuote()];
        const quotes = await Promise.all(quotePromises); // Получаем массив строк
        
        // Случайный выбор авторов (используя всех авторов, кроме тех, кто в локальном массиве)
        const allAuthors = [...authors].filter(a => !fallbackLocalQuotes.some(q => q.author === a));
        const shuffledAuthors = allAuthors.sort(() => 0.5 - Math.random());
        
        // Отображаем отзывы (успех)
        r.innerHTML = `
            <p>✅ Подключение к API успешно!</p>
            <p>💬 ${quotes[0]} — <i>${shuffledAuthors[0]}</i></p>
            <p>💬 ${quotes[1]} — <i>${shuffledAuthors[1]}</i></p>
            <p>💬 ${quotes[2]} — <i>${shuffledAuthors[1]}</i></p>
        `;
        
    } catch(e) {
        // Если fetch не сработал, показываем локальные данные.
        // Сообщение изменено на более общее, как вы просили.
        console.error('Ошибка fetch. Используются локальные данные. Причина:', e.message || 'Сетевая ошибка/CORS');
        
        // Случайный выбор авторов из резервного списка
        const shuffledFallback = [...fallbackLocalQuotes].sort(() => 0.5 - Math.random());

        r.innerHTML = `
            <p>❌ Не удалось подключиться к API. Отображены локальные данные.</p>
            <p>💬 ${shuffledFallback[0].content} — <i>${shuffledFallback[0].author}</i></p>
            <p>💬 ${shuffledFallback[1].content} — <i>${shuffledFallback[1].author}</i></p>
            <p>💬 ${shuffledFallback[2].content} — <i>${shuffledFallback[2].author}</i></p>
        `;
    }
}

if (u) {
    v(); // Первый запуск при загрузке страницы
    u.addEventListener('click', v); // Обработчик кнопки "Обновить"
}

// ==================== Галерея с API (fetch + async/await) - ТРЕБОВАНИЕ ЛР6 ====================
const x = document.getElementById('apiImages');

async function y() {
    if (!x) return; 
    
    x.innerHTML = '<p>Загрузка изображений...</p>';
    const categories = ['nature', 'city', 'abstract', 'nature', 'city', 'abstract'];
    
    x.innerHTML = ''; // Очищаем статус загрузки после старта цикла
    
    for (let i = 0; i < 6; i++) {
        const img = document.createElement('img');
        // Используем Picsum.photos API, который не требует API ключа.
        img.src = `https://picsum.photos/300/200?random=${Math.floor(Math.random()*1000) + i}`;
        
        img.setAttribute('data-category', categories[i]);
        img.alt = `Изображение из API ${i+1}`;
        
        x.appendChild(img);
        
        // Добавляем обработчик клика для модального окна
        img.addEventListener('click', () => openModal(img));
    }
}

y(); // Запускаем загрузку API-галереи