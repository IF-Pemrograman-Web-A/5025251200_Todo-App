const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('planova_theme', theme);
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        themeToggleBtn.setAttribute('aria-label', 'Beralih ke tampilan mode terang');
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        themeToggleBtn.setAttribute('aria-label', 'Beralih ke tampilan mode gelap');
    }
}

const currentTheme = localStorage.getItem('planova_theme') || 'light';
applyTheme(currentTheme);

themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
});
const DB_NAME = 'PlanovaTodoDB';
const DB_VERSION = 1;
const STORE_NAME = 'todos';
let dbInstance = null;

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = (e) => {
            dbInstance = e.target.result;
            loadAndRender();
            resolve(dbInstance);
        };
        req.onerror = (e) => reject('IndexedDB error: ' + e.target.errorCode);
    });
}

function getAllTodos() {
    return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
}

function insertTodo(todo) {
    return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(todo);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function updateTodo(todo) {
    return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(todo);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

function removeTodo(id) {
    return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}
let cameraStream = null;
let currentCapturedImage = null;

const startCamBtn = document.getElementById('start-cam-btn');
const captureCamBtn = document.getElementById('capture-cam-btn');
const stopCamBtn = document.getElementById('stop-cam-btn');
const videoElement = document.getElementById('camera-video');
const canvasElement = document.getElementById('camera-canvas');
const newImgPreview = document.getElementById('new-image-preview');
const newFileInput = document.getElementById('new-file');

startCamBtn.addEventListener('click', async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });
        videoElement.srcObject = cameraStream;
        videoElement.style.display = 'block';
        captureCamBtn.style.display = 'inline-block';
        stopCamBtn.style.display = 'inline-block';
        startCamBtn.style.display = 'none';
    } catch (err) {
        alert('Akses kamera tidak diizinkan atau tidak tersedia di perangkat ini.');
        console.error('Camera error:', err);
    }
});

captureCamBtn.addEventListener('click', () => {
    canvasElement.width = videoElement.videoWidth || 400;
    canvasElement.height = videoElement.videoHeight || 300;
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    currentCapturedImage = canvasElement.toDataURL('image/jpeg', 0.85);
    newImgPreview.src = currentCapturedImage;
    newImgPreview.style.display = 'block';
    stopCameraStream();
});

stopCamBtn.addEventListener('click', stopCameraStream);

function stopCameraStream() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    videoElement.style.display = 'none';
    captureCamBtn.style.display = 'none';
    stopCamBtn.style.display = 'none';
    startCamBtn.style.display = 'inline-block';
}

newFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            currentCapturedImage = evt.target.result;
            newImgPreview.src = currentCapturedImage;
            newImgPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW terdaftar di scope:', reg.scope))
        .catch(err => console.error('Pendaftaran Service Worker gagal:', err));
}

async function askNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
    }
}

function scheduleTaskReminder(title, reminderTime) {
    if (!reminderTime) return;
    const diff = new Date(reminderTime).getTime() - Date.now();
    if (diff > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted' && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'TRIGGER_NOTIFICATION',
                    title: `Pengingat Tugas: ${title}`,
                    body: 'Waktunya menyelesaikan aktivitas Anda!'
                });
            }
        }, diff);
    }
}
let allTodosList = [];
let activeSelectedId = null;
let currentStatusFilter = 'all';

const todoListContainer = document.getElementById('todo-list');
const taskCountElement = document.getElementById('task-count');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter button');
const statusLive = document.getElementById('status-live');

const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-description');
const prioritySelect = document.getElementById('priority');
const dateInput = document.getElementById('date');
const detailNotifyInput = document.getElementById('detail-notify');
const detailStatusBadge = document.getElementById('detail-status');
const detailImgPreview = document.getElementById('detail-image-preview');
const noImageText = document.getElementById('no-image-text');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

const newTodoForm = document.getElementById('new-todo-form');
const newTitleInput = document.getElementById('new-title');
const newDescInput = document.getElementById('new-description');
const newPriorityInput = document.getElementById('new-priority');
const newDateInput = document.getElementById('new-date');
const newNotifyInput = document.getElementById('new-notify');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatusFilter = btn.dataset.filter;
        renderTodoList();
    });
});

searchInput.addEventListener('input', () => {
    renderTodoList();
});

async function loadAndRender() {
    allTodosList = await getAllTodos();
    if (allTodosList.length > 0 && !activeSelectedId) {
        activeSelectedId = allTodosList[0].id;
    }
    renderTodoList();
    fillDetailPanel();
}

function renderTodoList() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allTodosList.filter(t => {
        const matchFilter = currentStatusFilter === 'all' 
            ? true 
            : currentStatusFilter === 'completed' ? t.completed : !t.completed;
        const matchSearch = t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query));
        return matchFilter && matchSearch;
    });

    taskCountElement.textContent = `${filtered.length} Tasks`;
    todoListContainer.innerHTML = '';

    if (filtered.length === 0) {
        todoListContainer.innerHTML = `<p style="color:var(--text-muted); padding: 15px; font-size:13px;">Tidak ada tugas yang cocok.</p>`;
        return;
    }

    filtered.forEach(todo => {
        const article = document.createElement('article');
        article.className = `todo-item ${todo.id === activeSelectedId ? 'selected' : ''}`;
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-label', `Lihat detail tugas: ${todo.title}`);

        const priorityClass = (todo.priority || 'medium').toLowerCase();

        article.innerHTML = `
            <button type="button" class="todo-check ${todo.completed ? 'completed-check' : ''}" aria-label="Tandai ${todo.title} selesai">
                ${todo.completed ? '✓' : ''}
            </button>
            <div class="todo-info">
                <h3 class="${todo.completed ? 'completed-text' : ''}">${todo.title}</h3>
                <p>${todo.description || 'Tidak ada deskripsi'}</p>
                <div class="todo-meta">
                    <span class="priority ${priorityClass}">${todo.priority || 'Medium'}</span>
                    <span>${todo.date ? todo.date : 'No date'}</span>
                    ${todo.notify ? `<span>⏰ ${new Date(todo.notify).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
                </div>
            </div>
            ${todo.image ? `<img src="${todo.image}" alt="Thumbnail" class="todo-thumb" />` : ''}
        `;

        article.addEventListener('click', (e) => {
            if (e.target.closest('.todo-check')) return;
            activeSelectedId = todo.id;
            renderTodoList();
            fillDetailPanel();
        });

        article.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (!e.target.closest('.todo-check')) {
                    e.preventDefault();
                    activeSelectedId = todo.id;
                    renderTodoList();
                    fillDetailPanel();
                }
            }
        });

        const checkBtn = article.querySelector('.todo-check');
        checkBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            todo.completed = !todo.completed;
            await updateTodo(todo);
            statusLive.textContent = `Tugas "${todo.title}" ditandai sebagai ${todo.completed ? 'selesai' : 'belum selesai'}.`;
            loadAndRender();
        });

        todoListContainer.appendChild(article);
    });
}

function fillDetailPanel() {
    const selectedTodo = allTodosList.find(t => t.id === activeSelectedId);
    if (!selectedTodo) {
        taskTitleInput.value = '';
        taskDescInput.value = '';
        prioritySelect.value = 'Medium';
        dateInput.value = '';
        detailNotifyInput.value = '';
        detailStatusBadge.textContent = 'None';
        detailImgPreview.style.display = 'none';
        noImageText.style.display = 'block';
        return;
    }

    taskTitleInput.value = selectedTodo.title || '';
    taskDescInput.value = selectedTodo.description || '';
    prioritySelect.value = selectedTodo.priority || 'Medium';
    dateInput.value = selectedTodo.date || '';
    detailNotifyInput.value = selectedTodo.notify || '';
    detailStatusBadge.textContent = selectedTodo.completed ? 'Completed' : 'In Progress';

    if (selectedTodo.image) {
        detailImgPreview.src = selectedTodo.image;
        detailImgPreview.style.display = 'block';
        noImageText.style.display = 'none';
    } else {
        detailImgPreview.style.display = 'none';
        noImageText.style.display = 'block';
    }
}

saveBtn.addEventListener('click', async () => {
    const todo = allTodosList.find(t => t.id === activeSelectedId);
    if (!todo) return;

    todo.title = taskTitleInput.value.trim() || todo.title;
    todo.description = taskDescInput.value.trim();
    todo.priority = prioritySelect.value;
    todo.date = dateInput.value;
    todo.notify = detailNotifyInput.value;

    await updateTodo(todo);
    scheduleTaskReminder(todo.title, todo.notify);
    statusLive.textContent = `Perubahan pada "${todo.title}" berhasil disimpan.`;
    loadAndRender();
});

deleteBtn.addEventListener('click', async () => {
    if (!activeSelectedId) return;
    const todo = allTodosList.find(t => t.id === activeSelectedId);
    const confirmed = confirm(`Hapus tugas "${todo?.title || ''}"?`);
    if (confirmed) {
        await removeTodo(activeSelectedId);
        statusLive.textContent = `Tugas telah berhasil dihapus.`;
        activeSelectedId = null;
        loadAndRender();
    }
});

newTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = newTitleInput.value.trim();
    if (!title) return;

    await askNotificationPermission();

    const newTodoItem = {
        title: title,
        description: newDescInput.value.trim(),
        priority: newPriorityInput.value,
        date: newDateInput.value,
        notify: newNotifyInput.value || null,
        image: currentCapturedImage || null,
        completed: false,
        createdDate: new Date().toISOString()
    };

    const newId = await insertTodo(newTodoItem);
    scheduleTaskReminder(title, newTodoItem.notify);

    newTodoForm.reset();
    currentCapturedImage = null;
    newImgPreview.style.display = 'none';
    stopCameraStream();

    activeSelectedId = newId;
    statusLive.textContent = `Tugas baru "${title}" berhasil ditambahkan.`;
    loadAndRender();
});

initDB();