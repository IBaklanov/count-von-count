import { createClient } from '@supabase/supabase-js'
import { CounterData, CountRequest } from '@count-von-count/shared/src'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      action,
      counter_name = 'default',
      increment = 1,
    }: CountRequest = req.body

    if (action === 'increment') {
      // Increment counter in Supabase
      const { data, error } = await supabase.rpc('increment_counter', {
        counter_name,
        increment_by: increment,
      })

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to increment counter' })
      }

      const result: CounterData = {
        counter_name,
        count: data || 0,
        timestamp: new Date().toISOString(),
      }

      return res.status(200).json(result)
    }

    if (action === 'get') {
      // Get current counter value
      const { data, error } = await supabase
        .from('counters')
        .select('count')
        .eq('name', counter_name)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to get counter' })
      }

      const result: CounterData = {
        counter_name,
        count: data?.count || 0,
        timestamp: new Date().toISOString(),
      }

      return res.status(200).json(result)
    }

    return res.status(400).json({ error: 'Invalid action' })
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
