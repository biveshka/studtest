import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Базовый URL для API запросов
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-emcd.onrender.com/api';

// Функция для выполнения HTTP запросов
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API функции для работы с тестами
export const testsAPI = {
  // Получить все тесты
  async getTests() {
    try {
      // Сначала пробуем через Supabase
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          questions (*),
          test_tags (
            tags (*)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        // Преобразуем теги в удобный формат
        return data.map(test => ({
          ...test,
          tags: test.test_tags?.map(tt => tt.tags) || []
        }))
      }
      
      // Если Supabase не сработал, пробуем через бэкенд API
      return await fetchAPI('/tests');
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw new Error('Не удалось загрузить тесты');
    }
  },

  // Получить тест по ID
  async getTestById(id) {
    try {
      // Сначала пробуем через Supabase
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          questions (*),
          test_tags (
            tags (*)
          )
        `)
        .eq('id', id)
        .single()
      
      if (!error && data) {
        return {
          ...data,
          tags: data.test_tags?.map(tt => tt.tags) || []
        }
      }
      
      // Если Supabase не сработал, пробуем через бэкенд API
      return await fetchAPI(`/tests/${id}`);
    } catch (error) {
      console.error('Error fetching test:', error);
      throw new Error('Тест не найден');
    }
  },

  // Создать тест
  async createTest(testData) {
    try {
      const { data: test, error: testError } = await supabase
        .from('tests')
        .insert([{
          title: testData.title,
          description: testData.description,
          question_count: testData.questions.length,
          max_score: testData.questions.reduce((sum, q) => sum + q.points, 0),
          is_published: testData.is_published,
          created_by: testData.created_by
        }])
        .select()
        .single()

      if (testError) throw testError

      // Создаем вопросы
      const questionsWithTestId = testData.questions.map(q => ({
        ...q,
        test_id: test.id
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsWithTestId)

      if (questionsError) throw questionsError

      // Добавляем теги
      if (testData.selectedTags && testData.selectedTags.length > 0) {
        const testTags = testData.selectedTags.map(tag => ({
          test_id: test.id,
          tag_id: tag.id
        }))

        const { error: tagsError } = await supabase
          .from('test_tags')
          .insert(testTags)

        if (tagsError) throw tagsError
      }

      return this.getTestById(test.id)
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  // Обновить тест
  async updateTest(testId, testData) {
    try {
      // Обновляем основную информацию теста
      const { error: testError } = await supabase
        .from('tests')
        .update({
          title: testData.title,
          description: testData.description,
          question_count: testData.questions.length,
          max_score: testData.questions.reduce((sum, q) => sum + q.points, 0),
          is_published: testData.is_published,
          updated_at: new Date().toISOString()
        })
        .eq('id', testId)

      if (testError) throw testError

      // Удаляем старые вопросы и создаем новые
      const { error: deleteQuestionsError } = await supabase
        .from('questions')
        .delete()
        .eq('test_id', testId)

      if (deleteQuestionsError) throw deleteQuestionsError

      const questionsWithTestId = testData.questions.map(q => ({
        ...q,
        test_id: testId
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsWithTestId)

      if (questionsError) throw questionsError

      // Обновляем теги
      const { error: deleteTagsError } = await supabase
        .from('test_tags')
        .delete()
        .eq('test_id', testId)

      if (deleteTagsError) throw deleteTagsError

      if (testData.selectedTags && testData.selectedTags.length > 0) {
        const testTags = testData.selectedTags.map(tag => ({
          test_id: testId,
          tag_id: tag.id
        }))

        const { error: tagsError } = await supabase
          .from('test_tags')
          .insert(testTags)

        if (tagsError) throw tagsError
      }

      return this.getTestById(testId)
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  },

  // Удалить тест
  async deleteTest(testId) {
    try {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  }
}

// API функции для работы с результатами
export const resultsAPI = {
  // Сохранить результат теста
  async saveResult(resultData) {
    try {
      const { data, error } = await supabase
        .from('results')
        .insert([{
          test_id: resultData.test_id,
          user_name: resultData.user_name,
          score: resultData.score,
          max_score: resultData.max_score,
          answers: resultData.answers,
          completed_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error saving result:', error);
      
      // Пробуем через бэкенд API
      try {
        return await fetchAPI('/results', {
          method: 'POST',
          body: JSON.stringify(resultData)
        });
      } catch (apiError) {
        throw new Error('Не удалось сохранить результат');
      }
    }
  },

  // Получить результаты по test_id
  async getResultsByTest(testId) {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('test_id', testId)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching results:', error);
      
      // Пробуем через бэкенд API
      try {
        return await fetchAPI(`/results/${testId}`);
      } catch (apiError) {
        return []; // Возвращаем пустой массив если не удалось загрузить
      }
    }
  },

  // Получить все результаты
  async getAllResults() {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('completed_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching all results:', error);
      return [];
    }
  }
}

// API функции для работы с пользователями
export const usersAPI = {
  // Авторизация администратора
  async adminLogin(email, password) {
    // В реальном приложении здесь должна быть proper аутентификация
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .single()

      if (error) throw new Error('Пользователь не найден')
      
      // В реальном приложении здесь должно быть сравнение хэшей паролей
      if (password !== 'admin123') {
        throw new Error('Неверный пароль')
      }

      return data
    } catch (error) {
      // Fallback для демо
      if (email === 'admin@test.ru' && password === 'admin123') {
        return {
          id: 1,
          email: 'admin@test.ru',
          full_name: 'Администратор Системы',
          role: 'admin'
        };
      }
      throw error;
    }
  },

  // Получить всех пользователей
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
}

// API функции для работы с тегами
export const tagsAPI = {
  // Получить все теги
  async getTags() {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Возвращаем базовые теги если не удалось загрузить
      return [
        { id: '1', name: 'JavaScript', color: '#f7df1e' },
        { id: '2', name: 'React', color: '#61dafb' },
        { id: '3', name: 'HTML/CSS', color: '#e34c26' },
        { id: '4', name: 'Базы данных', color: '#336791' }
      ];
    }
  },

  // Создать тег
  async createTag(tagData) {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([tagData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }
}