import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// API функции для работы с тестами
export const testsAPI = {
  // Получить все тесты
  async getTests() {
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
    
    if (error) throw error
    
    // Преобразуем теги в удобный формат
    return data.map(test => ({
      ...test,
      tags: test.test_tags?.map(tt => tt.tags) || []
    }))
  },

  // Получить тест по ID
  async getTestById(id) {
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
    
    if (error) throw error
    
    return {
      ...data,
      tags: data.test_tags?.map(tt => tt.tags) || []
    }
  },

  // Создать тест
  async createTest(testData) {
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
  },

  // Обновить тест
  async updateTest(testId, testData) {
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
  },

  // Удалить тест
  async deleteTest(testId) {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', testId)

    if (error) throw error
  }
}

// API функции для работы с результатами
export const resultsAPI = {
  // Сохранить результат теста
  async saveResult(resultData) {
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
  },

  // Получить результаты по test_id
  async getResultsByTest(testId) {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('test_id', testId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Получить все результаты
  async getAllResults() {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// API функции для работы с пользователями
export const usersAPI = {
  // Авторизация администратора
  async adminLogin(email, password) {
    // В реальном приложении здесь должна быть proper аутентификация
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
  },

  // Получить всех пользователей
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// API функции для работы с тегами
export const tagsAPI = {
  // Получить все теги
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  },

  // Создать тег
  async createTag(tagData) {
    const { data, error } = await supabase
      .from('tags')
      .insert([tagData])
      .select()

    if (error) throw error
    return data[0]
  }
}