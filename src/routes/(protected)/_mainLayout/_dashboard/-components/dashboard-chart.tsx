import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { name: "Jan", dons: 15000, depenses: 12000 },
  { name: "Fév", dons: 18000, depenses: 14500 },
  { name: "Mar", dons: 22000, depenses: 16000 },
  { name: "Avr", dons: 19000, depenses: 17500 },
  { name: "Mai", dons: 25000, depenses: 19000 },
  { name: "Juin", dons: 21000, depenses: 18500 },
]

const chartConfig = {
  dons: {
    label: "Dons",
    color: "var(--chart-1)",
  },
  depenses: {
    label: "Dépenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function DashboardChart() {

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}      
          tickMargin={10}       
          axisLine={false}      
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickMargin={10}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="dons"
          fill="var(--color-dons)" 
          radius={4}
        />
        <Bar
          dataKey="depenses"
          fill="var(--color-depenses)"
          radius={4} 
        />
      </BarChart>
    </ChartContainer>
  )
}