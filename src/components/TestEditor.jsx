import React, { useState } from 'react';

const TestEditor = ({ test, tags, onSave, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    title: test?.title || '',
    description: test?.description || '',
    is_published: test?.is_published ?? true,
    selectedTags: test?.tags || [],
    questions: test?.questions || [
      {
        id: Date.now(),
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        points: 1
      }
    ]
  });

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0,
          points: 1
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex)
      }));
    }
  };

  const updateQuestion = (questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, optIndex) =>
                optIndex === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.some(t => t.id === tag.id)
        ? prev.selectedTags.filter(t => t.id !== tag.id)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      alert('Введите название теста');
      return;
    }

    if (formData.questions.some(q => !q.question_text.trim())) {
      alert('Все вопросы должны иметь текст');
      return;
    }

    if (formData.questions.some(q => q.options.some(opt => !opt.trim()))) {
      alert('Все варианты ответов должны быть заполнены');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === 'create' ? 'Создание теста' : 'Редактирование теста'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация о тесте */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Основная информация</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название теста *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название теста"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание теста
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите описание теста"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({...prev, is_published: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                Опубликовать тест (сделать доступным для прохождения)
              </label>
            </div>
          </div>

          {/* Секция тегов */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Теги теста</h3>
            <p className="text-sm text-gray-600">Выберите теги для категоризации теста</p>
            
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.selectedTags.some(t => t.id === tag.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: formData.selectedTags.some(t => t.id === tag.id) 
                      ? tag.color 
                      : undefined
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            
            {formData.selectedTags.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Выбранные теги:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name} ×
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Вопросы */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Вопросы</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Добавить вопрос
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-800">Вопрос {questionIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Удалить вопрос
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Текст вопроса *
                    </label>
                    <input
                      type="text"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите текст вопроса"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Баллы за вопрос
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                      className="w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Варианты ответов *
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correct_answer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Вариант ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Отметьте правильный вариант ответа
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {mode === 'create' ? 'Создать тест' : 'Сохранить изменения'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestEditor;