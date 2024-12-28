import { ApiResponse } from "@/store/accounting/use-accounting-store"

export const transformActionTypeData = (data: ApiResponse) => {
  const actionTypes = data.deals.reduce((acc, deal) => {
    acc[deal.action_type] = (acc[deal.action_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(actionTypes).map(([type, count]) => ({
    type,
    count,
    fill: type === 'rent' ? "var(--color-rent)" : "var(--color-sale)"
  }))
}

export const transformMonthlyData = (data: ApiResponse) => {
  const monthlyDeals = data.deals.reduce((acc, deal) => {
    const month = new Date(deal.date).getMonth()
    const monthName = new Date(deal.date).toLocaleString('ru', { month: 'long' })
    
    if (!acc[month]) {
      acc[month] = {
        month: monthName,
        rent: 0,
        sale: 0
      }
    }
    
    acc[month][deal.action_type as 'rent' | 'sale'] += 1
    return acc
  }, {} as Record<number, { month: string; rent: number; sale: number }>)

  return Object.values(monthlyDeals)
}

