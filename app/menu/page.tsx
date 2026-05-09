import { supabase } from '@/lib/supabase'
import MenuClient from './menuclient'

export const dynamic = 'force-dynamic'

type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
  badge?: string
}

async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category')

  if (error) {
    console.error('Error fetching menu:', error)
    return []
  }
  return data as MenuItem[]
}

export default async function MenuPage() {
  const items = await getMenuItems()
  return <MenuClient items={items} />
}