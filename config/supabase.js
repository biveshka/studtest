import { createClient } from '@supabase/supabase-js'

// Прямое указание данных (только для разработки)
const supabaseUrl = 'https://yowmfvygsqlnbprjoxgo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd21mdnlnc3FsbmJwcmpveGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MTg2MzQsImV4cCI6MjAxODQ5NDYzNH0.8a0TmtLqJceMUZq64VhP0lCWO9C2a0WjvqKixwWn6cI'

export const supabase = createClient(supabaseUrl, supabaseKey)