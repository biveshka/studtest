import React, { useState, useEffect } from 'react'

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
]

function App() {
  const [currentScreen, setCurrentScreen] = useState('testList')
  const [tests] = useState(DEMO_TESTS)
  const [currentTest, setCurrentTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [userName, setUserName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  // Сброс состояния теста
  const resetTest = () => {
    setCurrentTest(null)
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setUserName('')
    setShowNameInput(false)
    setCurrentScreen('testList')
  }

  // Начать тест
  const startTest = (test) => {
    setCurrentTest(test)
    setShowNameInput(true)
  }

  // Подтвердить имя и начать тест
  const confirmNameAndStart = () => {
    if (!userName.trim()) {
      alert('Пожалуйста, введите ваше имя')
      return
    }
    setShowNameInput(false)
    setCurrentScreen('test')
  }

  // Выбрать ответ
  const selectAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  // Следующий вопрос
  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Предыдущий вопрос
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Рассчитать результат
  const calculateScore = () => {
    let score = 0
    currentTest.questions.forEach(question => {
      const userAnswer = userAnswers[question.id]
      if (userAnswer !== undefined && question.correct_answer === userAnswer) {
        score += question.points
      }
    })
    return score
  }

  // Завершить тест
  const finishTest = () => {
    const score = calculateScore()
    const maxScore = currentTest.max_score
    
    setCurrentScreen('results')
    // Здесь можно сохранить результаты
    console.log({
      userName,
      score,
      maxScore,
      testId: currentTest.id
    })
  }

  // Рендер списка тестов
  const renderTestList = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {test.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {test.description}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Вопросов: {test.question_count}
              </span>
              <span className="text-sm text-gray-500">
                Баллов: {test.max_score}
              </span>
            </div>
            <button
              onClick={() => startTest(test)}
              className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Начать тест
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  // Рендер ввода имени
  const renderNameInput = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Введите ваше имя</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && confirmNameAndStart()}
        />
        <button
          onClick={confirmNameAndStart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Начать тест
        </button>
      </div>
    </div>
  )

  // Рендер вопроса теста
  const renderTest = () => {
    if (!currentTest) return null
    
    const question = currentTest.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Прогресс бар */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Вопрос {currentQuestionIndex + 1} из {currentTest.questions.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {question.points} баллов
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Вопрос */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {question.question_text}
          </h2>
          
          {/* Варианты ответов */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(question.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  userAnswers[question.id] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Навигация */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Назад
          </button>

          {currentQuestionIndex === currentTest.questions.length - 1 ? (
            <button
              onClick={finishTest}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Завершить тест
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Далее
            </button>
          )}
        </div>
      </div>
    )
  }

  // Рендер результатов
  const renderResults = () => {
    if (!currentTest) return null
    
    const score = calculateScore()
    const maxScore = currentTest.max_score
    const percentage = Math.round((score / maxScore) * 100)

    let scoreColor = 'text-red-600'
    if (percentage >= 80) scoreColor = 'text-green-600'
    else if (percentage >= 60) scoreColor = 'text-yellow-600'

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Тест завершен!
          </h2>
          <div className={`text-5xl font-bold mb-4 ${scoreColor}`}>
            {score} / {maxScore}
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Поздравляем, {userName}!
          </p>
          <p className="text-gray-500">
            Ваш результат: {percentage}%
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={resetTest}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Система тестирования
          </h1>
          <p className="text-lg text-gray-600">
            Проверьте свои знания с помощью наших тестов
          </p>
        </header>
        
        {showNameInput && renderNameInput()}
        
        {currentScreen === 'testList' && renderTestList()}
        {currentScreen === 'test' && renderTest()}
        {currentScreen === 'results' && renderResults()}
      </div>
    </div>
  )
}

export default App