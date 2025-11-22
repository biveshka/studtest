// Расширенные демо данные
const DEMO_TESTS = [
    {
        id: 1,
        title: "Тест по JavaScript",
        description: "Проверьте свои знания JavaScript - от основ до продвинутых концепций",
        question_count: 8,
        max_score: 16,
        tags: ["programming", "javascript", "web"],
        is_published: true,
        questions: [
            {
                id: 101,
                question_text: "Что такое closure в JavaScript?",
                options: ["Функция внутри функции", "Область видимости функции", "Замыкание", "Все варианты"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 102,
                question_text: "Какой метод используется для создания элемента React?",
                options: ["React.createElement()", "React.newElement()", "React.makeElement()", "React.element()"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 103,
                question_text: "Что возвращает функция useState в React?",
                options: ["Только значение", "Только функцию обновления", "Массив [значение, функция]", "Объект с значением и функцией"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 104,
                question_text: "Что такое event bubbling в JavaScript?",
                options: ["Всплытие событий", "Погружение событий", "Остановка событий", "Отмена событий"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 105,
                question_text: "Какой оператор используется для проверки типа и значения?",
                options: ["==", "===", "=", "!=="],
                correct_answer: 1,
                points: 2
            },
            {
                id: 106,
                question_text: "Что такое Promise в JavaScript?",
                options: ["Обещание", "Асинхронная операция", "Объект для отложенных вычислений", "Все вышеперечисленное"],
                correct_answer: 3,
                points: 2
            },
            {
                id: 107,
                question_text: "Как объявить переменную с блочной областью видимости?",
                options: ["var", "let", "const", "let и const"],
                correct_answer: 3,
                points: 2
            },
            {
                id: 108,
                question_text: "Что делает метод Array.map()?",
                options: ["Фильтрует массив", "Создает новый массив", "Изменяет исходный массив", "Сортирует массив"],
                correct_answer: 1,
                points: 2
            }
        ]
    },
    {
        id: 2,
        title: "Тест по HTML/CSS",
        description: "Основы веб-разработки и стилизации",
        question_count: 6,
        max_score: 12,
        tags: ["html", "css", "web"],
        is_published: true,
        questions: [
            {
                id: 201,
                question_text: "Что означает CSS?",
                options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 202,
                question_text: "Какой тег используется для создания ссылки?",
                options: ["<link>", "<a>", "<href>", "<url>"],
                correct_answer: 1,
                points: 2
            },
            {
                id: 203,
                question_text: "Что такое Flexbox?",
                options: ["Модуль макета", "Система сеток", "Метод позиционирования", "Тип дисплея"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 204,
                question_text: "Какой атрибут используется для подсказки при наведении?",
                options: ["title", "hover", "tooltip", "alt"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 205,
                question_text: "Что делает z-index?",
                options: ["Задает прозрачность", "Управляет порядком наложения", "Определяет размер", "Задает вращение"],
                correct_answer: 1,
                points: 2
            },
            {
                id: 206,
                question_text: "Какой селектор имеет наибольший вес?",
                options: ["#id", ".class", "tag", "inline-style"],
                correct_answer: 3,
                points: 2
            }
        ]
    },
    {
        id: 3,
        title: "Тест по Python",
        description: "Основы программирования на Python",
        question_count: 7,
        max_score: 14,
        tags: ["programming", "python", "backend"],
        is_published: true,
        questions: [
            {
                id: 301,
                question_text: "Какой тип данных является изменяемым в Python?",
                options: ["tuple", "string", "list", "int"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 302,
                question_text: "Что выведет print(2 ** 3)?",
                options: ["6", "8", "9", "5"],
                correct_answer: 1,
                points: 2
            },
            {
                id: 303,
                question_text: "Как создать словарь?",
                options: ["{key: value}", "dict(key=value)", "Оба варианта", "Ни один"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 304,
                question_text: "Что такое list comprehension?",
                options: ["Список методов", "Сжатие списка", "Генератор списка", "Фильтр списка"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 305,
                question_text: "Какой модуль для HTTP запросов?",
                options: ["requests", "http", "urllib", "Все выше"],
                correct_answer: 3,
                points: 2
            },
            {
                id: 306,
                question_text: "Что такое декоратор?",
                options: ["Функция", "Класс", "Обертка функции", "Переменная"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 307,
                question_text: "Как обработать исключение?",
                options: ["try/except", "catch/throw", "error/handle", "check/except"],
                correct_answer: 0,
                points: 2
            }
        ]
    },
    {
        id: 4,
        title: "Тест по базам данных",
        description: "SQL и основы работы с базами данных",
        question_count: 5,
        max_score: 10,
        tags: ["database", "sql", "backend"],
        is_published: false,
        questions: [
            {
                id: 401,
                question_text: "Что означает SQL?",
                options: ["Structured Query Language", "Simple Question Language", "System Query Logic", "Structured Question Logic"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 402,
                question_text: "Какой оператор выбирает данные?",
                options: ["GET", "SELECT", "EXTRACT", "FIND"],
                correct_answer: 1,
                points: 2
            },
            {
                id: 403,
                question_text: "Что такое PRIMARY KEY?",
                options: ["Основной ключ", "Внешний ключ", "Уникальный ключ", "Составной ключ"],
                correct_answer: 0,
                points: 2
            },
            {
                id: 404,
                question_text: "Как объединить таблицы?",
                options: ["MERGE", "COMBINE", "JOIN", "UNITE"],
                correct_answer: 2,
                points: 2
            },
            {
                id: 405,
                question_text: "Что такое нормализация?",
                options: ["Ускорение БД", "Организация данных", "Резервное копирование", "Шифрование"],
                correct_answer: 1,
                points: 2
            }
        ]
    }
];

// Теги для фильтрации
const TAGS = [
    { id: 1, name: "programming", color: "#3B82F6", displayName: "Программирование" },
    { id: 2, name: "javascript", color: "#F59E0B", displayName: "JavaScript" },
    { id: 3, name: "html", color: "#EF4444", displayName: "HTML" },
    { id: 4, name: "css", color: "#8B5CF6", displayName: "CSS" },
    { id: 5, name: "python", color: "#10B981", displayName: "Python" },
    { id: 6, name: "web", color: "#EC4899", displayName: "Веб-разработка" },
    { id: 7, name: "database", color: "#6366F1", displayName: "Базы данных" },
    { id: 8, name: "sql", color: "#F97316", displayName: "SQL" },
    { id: 9, name: "backend", color: "#06B6D4", displayName: "Backend" }
];

// Хранилище результатов
let TEST_RESULTS = JSON.parse(localStorage.getItem('testResults')) || [];

class AdvancedQuizApp {
    constructor() {
        this.tests = JSON.parse(localStorage.getItem('tests')) || DEMO_TESTS;
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.userName = '';
        this.isAdmin = false;
        this.selectedTag = null;
        this.editingTest = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.showTestList();
        this.updateStats();
    }

    initializeElements() {
        // Основные экраны
        this.screens = {
            mainApp: document.getElementById('main-app'),
            adminLogin: document.getElementById('admin-login-screen'),
            testList: document.getElementById('test-list-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen')
        };

        // Элементы интерфейса
        this.testsContainer = document.getElementById('tests-container');
        this.adminTestsContainer = document.getElementById('admin-tests-container');
        this.tagsContainer = document.getElementById('tags-container');
        this.editorTagsContainer = document.getElementById('editor-tags-container');
        this.resultsContainer = document.getElementById('results-container');
        
        // Кнопки режима
        this.userModeBtn = document.getElementById('user-mode-btn');
        this.adminModeBtn = document.getElementById('admin-mode-btn');
        
        // Админ элементы
        this.adminPanel = document.getElementById('admin-panel');
        this.userInterface = document.getElementById('user-interface');
        this.createTestBtn = document.getElementById('create-test-btn');
        this.viewResultsBtn = document.getElementById('view-results-btn');
        
        // Форма входа админа
        this.adminLoginForm = document.getElementById('admin-login-form');
        
        // Элементы теста
        this.progressText = document.getElementById('progress-text');
        this.pointsText = document.getElementById('points-text');
        this.progressBar = document.getElementById('progress-bar');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.scoreDisplay = document.getElementById('score-display');
        this.userGreeting = document.getElementById('user-greeting');
        this.backToTestsBtn = document.getElementById('back-to-tests-btn');
        
        // Модальные окна
        this.nameModal = document.getElementById('name-modal');
        this.userNameInput = document.getElementById('user-name');
        this.startTestBtn = document.getElementById('start-test-btn');
        
        this.testEditorModal = document.getElementById('test-editor-modal');
        this.testEditorForm = document.getElementById('test-editor-form');
        this.editorTitle = document.getElementById('editor-title');
        this.testTitleInput = document.getElementById('test-title');
        this.testDescriptionInput = document.getElementById('test-description');
        this.questionsContainer = document.getElementById('questions-container');
        this.addQuestionBtn = document.getElementById('add-question-btn');
        this.cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        this.resultsModal = document.getElementById('results-modal');
        this.closeResultsBtn = document.getElementById('close-results-btn');
        
        // Статистика
        this.totalTestsEl = document.getElementById('total-tests');
        this.publishedTestsEl = document.getElementById('published-tests');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.completedTestsEl = document.getElementById('completed-tests');
    }

    attachEventListeners() {
        // Навигация
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitTest());
        this.backToTestsBtn.addEventListener('click', () => this.showTestList());
        
        // Режимы
        this.userModeBtn.addEventListener('click', () => this.setUserMode());
        this.adminModeBtn.addEventListener('click', () => this.showAdminLogin());
        this.adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        
        // Админ функции
        this.createTestBtn.addEventListener('click', () => this.createTest());
        this.viewResultsBtn.addEventListener('click', () => this.showResults());
        this.closeResultsBtn.addEventListener('click', () => this.hideResults());
        
        // Модальные окна
        this.startTestBtn.addEventListener('click', () => this.confirmNameAndStart());
        this.cancelEditBtn.addEventListener('click', () => this.hideTestEditor());
        this.testEditorForm.addEventListener('submit', (e) => this.saveTest(e));
        this.addQuestionBtn.addEventListener('click', () => this.addQuestionToEditor());
    }

    // ========== РЕЖИМЫ ==========
    setUserMode() {
        this.isAdmin = false;
        document.body.classList.remove('admin-mode');
        this.screens.adminLogin.classList.add('hidden');
        this.screens.mainApp.classList.add('active');
        this.showTestList();
    }

    showAdminLogin() {
        this.screens.mainApp.classList.remove('active');
        this.screens.adminLogin.classList.add('active');
    }

    handleAdminLogin(e) {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        if (email === 'admin@test.ru' && password === 'admin123') {
            this.isAdmin = true;
            document.body.classList.add('admin-mode');
            this.screens.adminLogin.classList.remove('active');
            this.screens.mainApp.classList.add('active');
            this.showAdminPanel();
        } else {
            alert('Неверный email или пароль!');
        }
    }

    // ========== АДМИН ПАНЕЛЬ ==========
    showAdminPanel() {
        this.adminPanel.classList.remove('hidden');
        this.userInterface.classList.add('hidden');
        this.renderAdminTests();
        this.updateStats();
    }

    renderAdminTests() {
        this.adminTestsContainer.innerHTML = this.tests.map(test => `
            <div class="bg-white rounded-lg shadow-lg p-6 border-2 ${test.is_published ? 'border-green-200' : 'border-yellow-200'}">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-semibold text-gray-800 flex-1">${test.title}</h3>
                    <span class="px-2 py-1 text-xs rounded-full ${test.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${test.is_published ? 'Опубликован' : 'Черновик'}
                    </span>
                </div>
                
                <p class="text-gray-600 mb-4 line-clamp-2">${test.description}</p>
                
                ${test.tags && test.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${test.tags.map(tagName => {
                            const tag = TAGS.find(t => t.name === tagName);
                            return tag ? `<span class="px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: ${tag.color}">${tag.displayName}</span>` : '';
                        }).join('')}
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center mb-4 text-sm text-gray-500">
                    <span>Вопросов: ${test.question_count}</span>
                    <span>Баллов: ${test.max_score}</span>
                </div>
                
                <div class="flex gap-2">
                    <button class="edit-test-btn flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors" data-test-id="${test.id}">
                        Редактировать
                    </button>
                    <button class="delete-test-btn bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors" data-test-id="${test.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Обработчики для кнопок админ-панели
        document.querySelectorAll('.edit-test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const testId = parseInt(e.target.dataset.testId);
                this.editTest(testId);
            });
        });

        document.querySelectorAll('.delete-test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const testId = parseInt(e.target.dataset.testId);
                this.deleteTest(testId);
            });
        });
    }

    updateStats() {
        const totalTests = this.tests.length;
        const publishedTests = this.tests.filter(t => t.is_published).length;
        const totalQuestions = this.tests.reduce((sum, test) => sum + test.question_count, 0);
        const completedTests = TEST_RESULTS.length;

        this.totalTestsEl.textContent = totalTests;
        this.publishedTestsEl.textContent = publishedTests;
        this.totalQuestionsEl.textContent = totalQuestions;
        this.completedTestsEl.textContent = completedTests;
    }

    // ========== УПРАВЛЕНИЕ ТЕСТАМИ ==========
    createTest() {
        this.editingTest = null;
        this.editorTitle.textContent = 'Создание теста';
        this.showTestEditor();
    }

    editTest(testId) {
        this.editingTest = this.tests.find(test => test.id === testId);
        this.editorTitle.textContent = 'Редактирование теста';
        this.showTestEditor();
    }

    showTestEditor() {
        this.testEditorModal.classList.remove('hidden');
        
        // Заполняем форму данными
        if (this.editingTest) {
            this.testTitleInput.value = this.editingTest.title;
            this.testDescriptionInput.value = this.editingTest.description;
            this.renderQuestions(this.editingTest.questions);
            this.renderEditorTags(this.editingTest.tags || []);
        } else {
            this.testTitleInput.value = '';
            this.testDescriptionInput.value = '';
            this.questionsContainer.innerHTML = '';
            this.renderEditorTags([]);
            this.addQuestionToEditor(); // Добавляем первый вопрос по умолчанию
        }
    }

    hideTestEditor() {
        this.testEditorModal.classList.add('hidden');
    }

    renderEditorTags(selectedTags) {
        this.editorTagsContainer.innerHTML = TAGS.map(tag => `
            <button type="button" class="tag px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag.name) 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }" data-tag-name="${tag.name}" style="${
                selectedTags.includes(tag.name) ? `background-color: ${tag.color}` : ''
            }">
                ${tag.displayName}
            </button>
        `).join('');

        // Обработчики для тегов в редакторе
        this.editorTagsContainer.querySelectorAll('.tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tagName = e.target.dataset.tagName;
                btn.classList.toggle('text-white');
                btn.classList.toggle('bg-gray-100');
                btn.classList.toggle('text-gray-700');
                btn.classList.toggle('hover:bg-gray-200');
                
                if (btn.classList.contains('text-white')) {
                    btn.style.backgroundColor = TAGS.find(t => t.name === tagName).color;
                } else {
                    btn.style.backgroundColor = '';
                }
            });
        });
    }

    addQuestionToEditor() {
        const questionId = Date.now();
        const questionHTML = `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 question-editor" data-question-id="${questionId}">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold text-gray-800">Вопрос</h4>
                    <button type="button" class="delete-question-btn text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Текст вопроса</label>
                        <input type="text" class="question-text w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Введите текст вопроса" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Баллы</label>
                        <input type="number" class="question-points w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value="2" min="1" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Варианты ответов</label>
                        <div class="space-y-2 options-container">
                            ${[0, 1, 2, 3].map(index => `
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="correct-${questionId}" value="${index}" class="correct-answer" ${index === 0 ? 'checked' : ''}>
                                    <input type="text" class="option-text flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Вариант ${index + 1}" required>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
        
        // Обработчик удаления вопроса
        const newQuestion = this.questionsContainer.lastElementChild;
        newQuestion.querySelector('.delete-question-btn').addEventListener('click', () => {
            if (this.questionsContainer.children.length > 1) {
                newQuestion.remove();
            } else {
                alert('Тест должен содержать хотя бы один вопрос!');
            }
        });
    }

    renderQuestions(questions) {
        this.questionsContainer.innerHTML = '';
        questions.forEach((question, index) => {
            const questionId = question.id || Date.now() + index;
            const questionHTML = `
                <div class="border border-gray-200 rounded-lg p-4 mb-4 question-editor" data-question-id="${questionId}">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-semibold text-gray-800">Вопрос ${index + 1}</h4>
                        <button type="button" class="delete-question-btn text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Текст вопроса</label>
                            <input type="text" class="question-text w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                   value="${question.question_text}" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Баллы</label>
                            <input type="number" class="question-points w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                   value="${question.points}" min="1" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Варианты ответов</label>
                            <div class="space-y-2 options-container">
                                ${question.options.map((option, optIndex) => `
                                    <div class="flex items-center gap-2">
                                        <input type="radio" name="correct-${questionId}" value="${optIndex}" class="correct-answer" ${optIndex === question.correct_answer ? 'checked' : ''}>
                                        <input type="text" class="option-text flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                               value="${option}" required>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
            
            // Обработчик удаления вопроса
            const questionEl = this.questionsContainer.lastElementChild;
            questionEl.querySelector('.delete-question-btn').addEventListener('click', () => {
                if (this.questionsContainer.children.length > 1) {
                    questionEl.remove();
                } else {
                    alert('Тест должен содержать хотя бы один вопрос!');
                }
            });
        });
    }

    saveTest(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const title = this.testTitleInput.value.trim();
        const description = this.testDescriptionInput.value.trim();
        
        if (!title) {
            alert('Введите название теста!');
            return;
        }
        
        // Собираем выбранные теги
        const selectedTags = Array.from(this.editorTagsContainer.querySelectorAll('.tag.text-white'))
                                .map(btn => btn.dataset.tagName);
        
        // Собираем вопросы
        const questions = Array.from(this.questionsContainer.querySelectorAll('.question-editor')).map((questionEl, index) => {
            const questionText = questionEl.querySelector('.question-text').value.trim();
            const points = parseInt(questionEl.querySelector('.question-points').value);
            const options = Array.from(questionEl.querySelectorAll('.option-text')).map(input => input.value.trim());
            const correctAnswer = parseInt(questionEl.querySelector('.correct-answer:checked').value);
            
            if (!questionText) {
                throw new Error(`Вопрос ${index + 1}: введите текст вопроса`);
            }
            
            if (options.some(opt => !opt)) {
                throw new Error(`Вопрос ${index + 1}: заполните все варианты ответов`);
            }
            
            return {
                id: parseInt(questionEl.dataset.questionId) || Date.now() + index,
                question_text: questionText,
                options: options,
                correct_answer: correctAnswer,
                points: points
            };
        });
        
        try {
            // Валидация вопросов
            if (questions.length === 0) {
                throw new Error('Добавьте хотя бы один вопрос');
            }
            
            // Создаем или обновляем тест
            const testData = {
                title,
                description,
                tags: selectedTags,
                questions,
                question_count: questions.length,
                max_score: questions.reduce((sum, q) => sum + q.points, 0),
                is_published: true
            };
            
            if (this.editingTest) {
                // Обновляем существующий тест
                Object.assign(this.editingTest, testData);
            } else {
                // Создаем новый тест
                const newTest = {
                    id: Date.now(),
                    ...testData
                };
                this.tests.push(newTest);
            }
            
            // Сохраняем в localStorage
            this.saveTestsToStorage();
            this.updateStats();
            this.hideTestEditor();
            
            // Обновляем интерфейс
            if (this.isAdmin) {
                this.renderAdminTests();
            } else {
                this.renderTests();
            }
            
            alert(this.editingTest ? 'Тест обновлен!' : 'Тест создан!');
            
        } catch (error) {
            alert(error.message);
        }
    }

    deleteTest(testId) {
        if (confirm('Вы уверены, что хотите удалить этот тест?')) {
            this.tests = this.tests.filter(test => test.id !== testId);
            this.saveTestsToStorage();
            this.updateStats();
            this.renderAdminTests();
            alert('Тест удален!');
        }
    }

    saveTestsToStorage() {
        localStorage.setItem('tests', JSON.stringify(this.tests));
    }

    // ========== РЕЗУЛЬТАТЫ ==========
    showResults() {
        this.resultsModal.classList.remove('hidden');
        this.renderResults();
    }

    hideResults() {
        this.resultsModal.classList.add('hidden');
    }

    renderResults() {
        if (TEST_RESULTS.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">Результаты не найдены</p>
                </div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = TEST_RESULTS.map(result => {
            const test = this.tests.find(t => t.id === result.test_id);
            const percentage = Math.round((result.score / result.max_score) * 100);
            const scoreColor = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
            
            return `
                <div class="border border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-semibold text-gray-800">${test ? test.title : 'Неизвестный тест'}</h4>
                            <p class="text-sm text-gray-600">Ученик: ${result.user_name}</p>
                        </div>
                        <span class="text-sm text-gray-500">${new Date(result.timestamp).toLocaleDateString('ru-RU')}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="${scoreColor} font-bold text-lg">
                            ${result.score} / ${result.max_score} (${percentage}%)
                        </div>
                        <div class="text-sm text-gray-600">
                            Правильных ответов: ${result.correct_answers}/${result.total_questions}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    saveResult(testId, score, maxScore, correctAnswers, totalQuestions) {
        const result = {
            id: Date.now(),
            test_id: testId,
            user_name: this.userName,
            score: score,
            max_score: maxScore,
            correct_answers: correctAnswers,
            total_questions: totalQuestions,
            timestamp: new Date().toISOString()
        };
        
        TEST_RESULTS.push(result);
        localStorage.setItem('testResults', JSON.stringify(TEST_RESULTS));
    }

    // ========== ИНТЕРФЕЙС ПОЛЬЗОВАТЕЛЯ ==========
    showTestList() {
        this.screens.testList.classList.add('active');
        this.screens.test.classList.remove('active');
        this.screens.results.classList.remove('active');
        this.renderTests();
        this.renderTags();
    }

    renderTags() {
        const allTags = ['all', ...new Set(this.tests.flatMap(test => test.tags || []))];
        
        this.tagsContainer.innerHTML = allTags.map(tagName => {
            if (tagName === 'all') {
                return `
                    <button class="tag px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !this.selectedTag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }" data-tag="all">
                        Все тесты
                    </button>
                `;
            }
            
            const tag = TAGS.find(t => t.name === tagName);
            if (!tag) return '';
            
            return `
                <button class="tag px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    this.selectedTag === tagName ? 'text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }" data-tag="${tag.name}" style="${
                    this.selectedTag === tagName ? `background-color: ${tag.color}` : ''
                }">
                    ${tag.displayName}
                </button>
            `;
        }).join('');

        // Обработчики для тегов
        this.tagsContainer.querySelectorAll('.tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                this.selectedTag = tag === 'all' ? null : tag;
                this.renderTests();
                this.renderTags();
            });
        });
    }

    renderTests() {
        const filteredTests = this.selectedTag 
            ? this.tests.filter(test => test.tags && test.tags.includes(this.selectedTag) && test.is_published)
            : this.tests.filter(test => test.is_published);

        this.testsContainer.innerHTML = filteredTests.map(test => `
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 test-card">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">${test.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${test.description}</p>
                
                ${test.tags && test.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${test.tags.map(tagName => {
                            const tag = TAGS.find(t => t.name === tagName);
                            return tag ? `<span class="px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: ${tag.color}">${tag.displayName}</span>` : '';
                        }).join('')}
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm text-gray-500">Вопросов: ${test.question_count}</span>
                    <span class="text-sm text-gray-500">Баллов: ${test.max_score}</span>
                </div>
                <button 
                    class="test-start-btn w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200" 
                    data-test-id="${test.id}"
                >
                    Начать тест
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.test-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const testId = parseInt(e.target.dataset.testId);
                this.startTest(testId);
            });
        });
    }

    // ========== ПРОХОЖДЕНИЕ ТЕСТА ==========
    startTest(testId) {
        this.currentTest = this.tests.find(test => test.id === testId);
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.showNameModal();
    }

    showNameModal() {
        this.nameModal.classList.remove('hidden');
        this.userNameInput.value = '';
        this.userNameInput.focus();
    }

    confirmNameAndStart() {
        this.userName = this.userNameInput.value.trim();
        if (!this.userName) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        this.nameModal.classList.add('hidden');
        this.showTestQuestion();
    }

    showTestQuestion() {
        this.screens.testList.classList.remove('active');
        this.screens.test.classList.add('active');
        
        const question = this.currentTest.questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / this.currentTest.questions.length) * 100;
        
        this.progressText.textContent = `Вопрос ${this.currentQuestionIndex + 1} из ${this.currentTest.questions.length}`;
        this.pointsText.textContent = `${question.points} баллов`;
        this.progressBar.style.width = `${progress}%`;
        
        this.questionText.textContent = question.question_text;
        
        this.answersContainer.innerHTML = question.options.map((option, index) => `
            <div class="answer-option w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                this.userAnswers[question.id] === index 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 selected' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }" data-question-id="${question.id}" data-answer-index="${index}">
                ${option}
            </div>
        `).join('');

        this.answersContainer.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const questionId = parseInt(e.currentTarget.dataset.questionId);
                const answerIndex = parseInt(e.currentTarget.dataset.answerIndex);
                this.selectAnswer(questionId, answerIndex);
            });
        });

        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.currentTest.questions.length - 1) {
            this.nextBtn.classList.add('hidden');
            this.submitBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.submitBtn.classList.add('hidden');
        }
    }

    selectAnswer(questionId, answerIndex) {
        this.userAnswers[questionId] = answerIndex;
        
        this.answersContainer.querySelectorAll('.answer-option').forEach(option => {
            const optionQuestionId = parseInt(option.dataset.questionId);
            const optionAnswerIndex = parseInt(option.dataset.answerIndex);
            
            if (optionQuestionId === questionId) {
                if (optionAnswerIndex === answerIndex) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            }
        });
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showTestQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentTest.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showTestQuestion();
        }
    }

    calculateScore() {
        let score = 0;
        let correctAnswers = 0;
        
        this.currentTest.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            if (userAnswer !== undefined && question.correct_answer === userAnswer) {
                score += question.points;
                correctAnswers++;
            }
        });
        
        return { score, correctAnswers };
    }

    submitTest() {
        const { score, correctAnswers } = this.calculateScore();
        const maxScore = this.currentTest.max_score;
        const totalQuestions = this.currentTest.questions.length;
        const percentage = Math.round((score / maxScore) * 100);

        // Сохраняем результат
        this.saveResult(this.currentTest.id, score, maxScore, correctAnswers, totalQuestions);

        // Показываем результаты
        this.screens.test.classList.remove('active');
        this.screens.results.classList.add('active');
        
        let scoreColor = 'text-red-600';
        if (percentage >= 80) scoreColor = 'text-green-600';
        else if (percentage >= 60) scoreColor = 'text-yellow-600';

        this.scoreDisplay.textContent = `${score} / ${maxScore}`;
        this.scoreDisplay.className = `text-5xl font-bold mb-4 ${scoreColor}`;
        this.userGreeting.textContent = `Поздравляем, ${this.userName}! Ваш результат: ${percentage}%`;
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedQuizApp();
});