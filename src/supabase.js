// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Используем переменную окружения для бэкенда
const supabaseUrl = process.env.VITE_BACKEND_URL || 'https://yowmfvygsqlnbprjoxgo.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd21mdnlnc3FsbmJwcmpveGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MTg2MzQsImV4cCI6MjAxODQ5NDYzNH0.8a0TmtLqJceMUZq64VhP0lCWO9C2a0WjvqKixwWn6cI'

console.log('Connecting to Supabase:', supabaseUrl)

// Создаем клиент с правильными настройками
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Функция для проверки подключения
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('tests').select('id').limit(1)
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('✅ Supabase connection: SUCCESS')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}