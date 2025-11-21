import React, { useState, useEffect } from 'react';

const TestTaking = ({ test, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.time_limit * 60);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Таймер
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(timer);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    clearInterval(timer);
    
    // Расчет результата
    const correctAnswers = test.questions.filter(question => 
      answers[question.id] === question.correct_answer
    ).length;
    
    const score = Math.round((correctAnswers / test.questions.length) * 100);
    const timeSpent = test.time_limit * 60 - timeLeft;

    const resultData = {
      test_id: test.id,
      user_name: 'Анонимный пользователь', // В реальном приложении - из профиля
      score: score,
      time_spent: Math.round(timeSpent / 60),
      total_questions: test.questions.length,
      correct_answers: correctAnswers,
      answers: answers
    };

    onComplete(resultData);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const question = test.questions[currentQuestion];

  return (
    <div className="test-taking">
      <div className="container">
        <div className="test-header">
          <button className="back-btn" onClick={onBack}>← Назад</button>
          <h1>{test.title}</h1>
          <div className="timer">⏱️ {formatTime(timeLeft)}</div>
        </div>

        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
          ></div>
          <span>Вопрос {currentQuestion + 1} из {test.questions.length}</span>
        </div>

        <div className="question-card">
          <h3>{question.question_text}</h3>
          
          {question.question_type === 'multiple_choice' && (
            <div className="options">
              {question.options.map((option, index) => (
                <label key={index} className="option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.question_type === 'text' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Введите ваш ответ..."
              rows={4}
            />
          )}
        </div>

        <div className="navigation">
          <button onClick={handlePrev} disabled={currentQuestion === 0}>
            ← Назад
          </button>
          
          {currentQuestion === test.questions.length - 1 ? (
            <button onClick={handleSubmit} className="submit-btn">
              Завершить тест
            </button>
          ) : (
            <button onClick={handleNext}>
              Далее →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTaking;