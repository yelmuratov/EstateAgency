"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CartesianGrid, XAxis, YAxis, Pie, PieChart, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from 'lucide-react'
import { Label } from "recharts"

// Define types for metrics and transaction data
interface Metrics {
  deals: number
  views: number
  objects: number
  clients: number
}

interface Transaction {
  date: string
  total_amount: number
  commission: number
}

interface Trend {
  date: string
  amount: number
  commission: number
}

// Transform metrics data for the pie chart
const getMetricsDistribution = (metrics: Metrics) => [
  { name: "Сделки", value: metrics.deals },
  { name: "Показы", value: metrics.views },
  { name: "Объекты", value: metrics.objects },
  { name: "Клиенты", value: metrics.clients },
]

// Config for the metrics distribution chart
const metricsConfig = {
  deals: {
    label: "Сделки",
    color: "hsl(var(--chart-1))",
  },
  views: {
    label: "Показы",
    color: "hsl(var(--chart-2))",
  },
  objects: {
    label: "Объекты",
    color: "hsl(var(--chart-3))",
  },
  clients: {
    label: "Клиенты",
    color: "hsl(var(--chart-4))",
  },
}

// Transform transaction data for the trends chart
const getTransactionTrends = (data: Transaction[]): Trend[] => {
  const trends = data.reduce((acc: Record<string, Trend>, item: Transaction) => {
    const date = new Date(item.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { date, amount: 0, commission: 0 }
    }
    acc[date].amount += Number(item.total_amount)
    acc[date].commission += Number(item.commission)
    return acc
  }, {})
  return Object.values(trends)
}

// Config for the transaction trends chart
const trendsConfig = {
  amount: {
    label: "Сумма",
    color: "hsl(var(--chart-1))",
  },
  commission: {
    label: "Комиссия",
    color: "hsl(var(--chart-2))",
  },
}

interface AccountingChartsProps {
  statistics: {
    metrics: Metrics
  }
  data: Transaction[]
}

export default function AccountingCharts({ statistics, data }: AccountingChartsProps) {
  const metricsData = getMetricsDistribution(statistics.metrics)
  const trendsData = getTransactionTrends(data)
  const totalMetrics = metricsData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Распределение метрик</CardTitle>
          <CardDescription>Текущий период</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={metricsConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={metricsData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalMetrics}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Всего
                          </tspan>
                        </text>
                      )}
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тренды транзакций</CardTitle>
            <CardDescription>Суммы и комиссии</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendsConfig}>
              <LineChart data={trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-amount)" }}
                />
                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="var(--color-commission)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-commission)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4" />
              Динамика за выбранный период
            </div>
          </CardFooter>
        </Card>
      </div>
    )
}

