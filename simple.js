// Демо данные для тестов
const DEMO_TESTS = [
    {
        id: 1,
        title: "Тест по JavaScript",
        description: "Проверьте свои знания JavaScript",
        question_count: 3,
        max_score: 6,
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
            }
        ]
    },
    {
        id: 2,
        title: "Тест по HTML/CSS",
        description: "Основы веб-разработки",
        question_count: 2,
        max_score: 4,
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
            }
        ]
    }
];

class SimpleQuizApp {
    constructor() {
        this.tests = DEMO_TESTS;
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        
        this.initializeElements();
        this.attachEventListeners();
        this.showTestList();
    }

    initializeElements() {
        this.screens = {
            testList: document.getElementById('test-list-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen')
        };

        this.testsContainer = document.getElementById('tests-container');
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
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitTest());
        this.backToTestsBtn.addEventListener('click', () => this.showTestList());
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.remove('hidden');
        }
    }

    showTestList() {
        this.showScreen('testList');
        this.renderTests();
    }

    renderTests() {
        this.testsContainer.innerHTML = this.tests.map(test => `
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 test-card">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">${test.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${test.description}</p>
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

    startTest(testId) {
        this.currentTest = this.tests.find(test => test.id === testId);
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.showTestQuestion();
    }

    showTestQuestion() {
        this.showScreen('test');
        const question = this.currentTest.questions[this.currentQuestionIndex];
        
        const progress = ((this.currentQuestionIndex + 1) / this.currentTest.questions.length) * 100;
        this.progressText.textContent = `Вопрос ${this.currentQuestionIndex + 1} из ${this.currentTest.questions.length}`;
        this.pointsText.textContent = `${question.points} баллов`;
        this.progressBar.style.width = `${progress}%`;
        
        this.questionText.textContent = question.question_text;
        
        this.answersContainer.innerHTML = question.options.map((option, index) => `
            <div class="answer-option ${
                this.userAnswers[question.id] === index ? 'selected' : ''
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
        this.currentTest.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            if (userAnswer !== undefined && question.correct_answer === userAnswer) {
                score += question.points;
            }
        });
        return score;
    }

    submitTest() {
        const score = this.calculateScore();
        const maxScore = this.currentTest.max_score;
        const percentage = Math.round((score / maxScore) * 100);

        let scoreColor = 'text-red-600';
        if (percentage >= 80) scoreColor = 'text-green-600';
        else if (percentage >= 60) scoreColor = 'text-yellow-600';

        this.scoreDisplay.textContent = `${score} / ${maxScore}`;
        this.scoreDisplay.className = `text-5xl font-bold mb-4 ${scoreColor}`;
        this.userGreeting.textContent = `Ваш результат: ${percentage}%`;

        this.showScreen('results');
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new SimpleQuizApp();
});