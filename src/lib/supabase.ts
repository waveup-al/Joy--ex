import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwpwbcuypzbjwvvopkzn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cHdiY3V5cHpiand2dm9wa3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDI1MjcsImV4cCI6MjA3NDUxODUyN30.Ee_tGTdDEBxum15bcG4FmYpumHtjDgckZGXENsUZfbo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export interface Job {
  id: string
  user_id: string
  mode: 'edit' | 'replace'
  prompt: string
  images: string[]
  output_url?: string
  meta?: Record<string, unknown>
  created_at: string
}

// Mock functions for demo purposes
export async function saveJobToHistory(job: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
  // In a real app, this would save to Supabase
  const mockJob: Job = {
    ...job,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
  }
  
  // Store in localStorage for demo (only on client side)
  if (typeof window !== 'undefined') {
    const existingJobs = JSON.parse(localStorage.getItem('demo_jobs') || '[]')
    existingJobs.unshift(mockJob)
    localStorage.setItem('demo_jobs', JSON.stringify(existingJobs.slice(0, 50))) // Keep only 50 recent jobs
  }
  
  return mockJob
}

export async function getUserJobs(userId: string): Promise<Job[]> {
  // In a real app, this would fetch from Supabase
  if (typeof window === 'undefined') {
    return [] // Return empty array on server side
  }
  
  try {
    const jobs = JSON.parse(localStorage.getItem('demo_jobs') || '[]')
    return jobs.filter((job: Job) => job.user_id === userId)
  } catch {
    return []
  }
}

export async function deleteJob(jobId: string, userId: string): Promise<void> {
  // In a real app, this would delete from Supabase
  if (typeof window === 'undefined') {
    return // Do nothing on server side
  }
  
  try {
    const jobs = JSON.parse(localStorage.getItem('demo_jobs') || '[]')
    const filteredJobs = jobs.filter((job: Job) => !(job.id === jobId && job.user_id === userId))
    localStorage.setItem('demo_jobs', JSON.stringify(filteredJobs))
  } catch {
    // Ignore errors in demo mode
  }
}