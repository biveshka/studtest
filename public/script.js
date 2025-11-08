class QuizApp {
    constructor() {
        this.API_BASE_URL = 'https://backend-emcd.onrender.com'; // Измените на ваш URL бэкенда
        this.tests = [];
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.userName = '';
        this.currentTestId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTests();
    }

    initializeElements() {
        // Экраны
        this.screens = {
            testList: document.getElementById('test-list-screen'),
            name: document.getElementById('name-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen')
        };

        // Элементы списка тестов
        this.testsContainer = document.getElementById('tests-container');
        this.noTests = document.getElementById('no-tests');

        // Элементы экрана имени
        this.userNameInput = document.getElementById('user-name');
        this.startTestBtn = document.getElementById('start-test-btn');

        // Элементы экрана теста
        this.progressText = document.getElementById('progress-text');
        this.pointsText = document.getElementById('points-text');
        this.progressBar = document.getElementById('progress-bar');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');

        // Элементы экрана результатов
        this.scoreDisplay = document.getElementById('score-display');
        this.userGreeting = document.getElementById('user-greeting');
        this.percentage = document.getElementById('percentage');
        this.resultsHistory = document.getElementById('results-history');
        this.noResults = document.getElementById('no-results');
        this.backToTestsBtn = document.getElementById('back-to-tests-btn');

        // Индикатор загрузки
        this.loading = document.getElementById('loading');
    }

    attachEventListeners() {
        this.startTestBtn.addEventListener('click', () => this.startTest());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitTest());
        this.backToTestsBtn.addEventListener('click', () => this.showTestList());
    }

    showScreen(screenName) {
        // Скрыть все экраны
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        // Показать нужный экран
        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.remove('hidden');
        }
    }

    showLoading(show = true) {
        if (show) {
            this.loading.classList.remove('hidden');
        } else {
            this.loading.classList.add('hidden');
        }
    }

    async loadTests() {
        this.showLoading(true);
        try {
            const response = await fetch(`${this.API_BASE_URL}/tests`);
            this.tests = await response.json();
            this.renderTests();
        } catch (error) {
            console.error('Error loading tests:', error);
            this.showError('Не удалось загрузить тесты');
        } finally {
            this.showLoading(false);
        }
    }

    renderTests() {
        if (this.tests.length === 0) {
            this.noTests.classList.remove('hidden');
            this.testsContainer.innerHTML = '';
            return;
        }

        this.noTests.classList.add('hidden');
        this.testsContainer.innerHTML = this.tests.map(test => `
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 test-card">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">${test.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${test.description || 'Описание отсутствует'}</p>
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

        // Добавляем обработчики для кнопок начала теста
        document.querySelectorAll('.test-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const testId = e.target.dataset.testId;
                this.prepareTest(testId);
            });
        });
    }

    prepareTest(testId) {
        this.currentTestId = testId;
        this.showScreen('name');
    }

    async startTest() {
        this.userName = this.userNameInput.value.trim();
        
        if (!this.userName) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        this.showLoading(true);
        try {
            const response = await fetch(`${this.API_BASE_URL}/tests/${this.currentTestId}`);
            this.currentTest = await response.json();
            this.currentQuestionIndex = 0;
            this.userAnswers = {};
            this.showTestQuestion();
        } catch (error) {
            console.error('Error loading test:', error);
            this.showError('Не удалось загрузить тест');
        } finally {
            this.showLoading(false);
        }
    }

    showTestQuestion() {
        this.showScreen('test');
        const question = this.currentTest.questions[this.currentQuestionIndex];
        
        // Обновляем прогресс
        const progress = ((this.currentQuestionIndex + 1) / this.currentTest.questions.length) * 100;
        this.progressText.textContent = `Вопрос ${this.currentQuestionIndex + 1} из ${this.currentTest.questions.length}`;
        this.pointsText.textContent = `${question.points} баллов`;
        this.progressBar.style.width = `${progress}%`;
        
        // Показываем вопрос
        this.questionText.textContent = question.question_text;
        
        // Показываем варианты ответов
        this.answersContainer.innerHTML = question.options.map((option, index) => `
            <div class="answer-option w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                this.userAnswers[question.id] === index 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }" data-question-id="${question.id}" data-answer-index="${index}">
                ${option}
            </div>
        `).join('');

        // Добавляем обработчики для вариантов ответов
        this.answersContainer.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const questionId = e.currentTarget.dataset.questionId;
                const answerIndex = parseInt(e.currentTarget.dataset.answerIndex);
                this.selectAnswer(questionId, answerIndex);
            });
        });

        // Обновляем кнопки навигации
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
        
        // Обновляем стили выбранного ответа
        this.answersContainer.querySelectorAll('.answer-option').forEach(option => {
            const optionQuestionId = option.dataset.questionId;
            const optionAnswerIndex = parseInt(option.dataset.answerIndex);
            
            if (optionQuestionId === questionId) {
                if (optionAnswerIndex === answerIndex) {
                    option.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-700');
                    option.classList.remove('border-gray-200', 'hover:border-gray-300', 'hover:bg-gray-50');
                } else {
                    option.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-700');
                    option.classList.add('border-gray-200', 'hover:border-gray-300', 'hover:bg-gray-50');
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
        this.currentTest.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            if (userAnswer !== undefined && question.correct_answer === userAnswer) {
                score += question.points;
            }
        });
        return score;
    }

    async submitTest() {
        const score = this.calculateScore();
        const maxScore = this.currentTest.questions.reduce((sum, q) => sum + q.points, 0);

        this.showLoading(true);
        try {
            // Сохраняем результат
            await fetch(`${this.API_BASE_URL}/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    test_id: this.currentTest.id,
                    user_name: this.userName,
                    score: score,
                    max_score: maxScore,
                    answers: Object.entries(this.userAnswers).map(([questionId, answerIndex]) => ({
                        question_id: questionId,
                        answer_index: answerIndex
                    }))
                })
            });

            // Показываем результаты
            await this.showResults(score, maxScore);
        } catch (error) {
            console.error('Error submitting test:', error);
            this.showError('Не удалось сохранить результаты');
        } finally {
            this.showLoading(false);
        }
    }

    async showResults(score, maxScore) {
        this.showScreen('results');
        
        // Показываем текущий результат
        const percentage = Math.round((score / maxScore) * 100);
        let scoreColor = 'text-red-600';
        if (percentage >= 80) scoreColor = 'text-green-600';
        else if (percentage >= 60) scoreColor = 'text-yellow-600';

        this.scoreDisplay.textContent = `${score} / ${maxScore}`;
        this.scoreDisplay.className = `text-5xl font-bold mb-4 ${scoreColor}`;
        this.userGreeting.textContent = `Поздравляем, ${this.userName}!`;
        this.percentage.textContent = `Ваш результат: ${percentage}%`;

        // Загружаем историю результатов
        await this.loadResultsHistory();
    }

    async loadResultsHistory() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/results/${this.currentTestId}`);
            const results = await response.json();
            this.renderResultsHistory(results);
        } catch (error) {
            console.error('Error loading results history:', error);
        }
    }

    renderResultsHistory(results) {
        if (results.length === 0) {
            this.noResults.classList.remove('hidden');
            this.resultsHistory.innerHTML = '';
            return;
        }

        this.noResults.classList.add('hidden');
        this.resultsHistory.innerHTML = results.map(result => {
            const percentage = (result.score / result.max_score) * 100;
            let scoreColor = 'text-red-600';
            if (percentage >= 80) scoreColor = 'text-green-600';
            else if (percentage >= 60) scoreColor = 'text-yellow-600';

            return `
                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <span class="font-semibold text-gray-800">${result.user_name}</span>
                        <span class="text-gray-500 text-sm ml-2">
                            ${new Date(result.completed_at).toLocaleDateString('ru-RU')}
                        </span>
                    </div>
                    <div class="font-bold ${scoreColor}">
                        ${result.score} / ${result.max_score}
                    </div>
                </div>
            `;
        }).join('');
    }

    showTestList() {
        this.userNameInput.value = '';
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.showScreen('testList');
        this.loadTests(); // Перезагружаем тесты на случай изменений
    }

    showError(message) {
        alert(message);
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});