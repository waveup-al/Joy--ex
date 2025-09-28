// Test script để kiểm tra kết nối Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://pwpwbcuypzbjwvvopkzn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cHdiY3V5cHpiand2dm9wa3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDI1MjcsImV4cCI6MjA3NDUxODUyN30.Ee_tGTdDEBxum15bcG4FmYpumHtjDgckZGXENsUZfbo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔄 Đang test kết nối Supabase...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('jobs')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Lỗi kết nối:', error.message)
      return false
    }
    
    console.log('✅ Kết nối Supabase thành công!')
    console.log('📊 Database response:', data)
    return true
    
  } catch (err) {
    console.error('❌ Lỗi không mong đợi:', err.message)
    return false
  }
}

testConnection()