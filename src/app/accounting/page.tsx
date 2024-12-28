"use client";

import { useEffect, useState } from "react";
import { useAccountingStore } from "@/store/accounting/use-accounting-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, TrendingUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserStore } from "@/store/users/userStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Label,
  Pie,
  PieChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import Spinner from "@/components/local-components/spinner";
import { useAuthStore } from "@/store/authStore";

export default function AccountingPage() {
  const { data, statistics, loading, fetchData } = useAccountingStore();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [actionType, setActionType] = useState<string>("sale");
  const [responsible, setResponsible] = useState<string>("");
  const { users, fetchUsers } = UserStore();
  const router = useRouter();
  const [isSuperUser, isSuperUserLoading] = useIsSuperUser();
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [showTodayFilter, setShowTodayFilter] = useState(false);
  const { token } = useAuthStore();

  const [viewsCount, setViewsCount] = useState(0);
  const [dealsCount, setDealsCount] = useState(0);
  const [objectsCount, setObjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);

  console.log(statistics);
  // Updated metrics data based on actual statistics

  useEffect(() => {
    setViewsCount(statistics.metrics.views);
    setDealsCount(statistics.metrics.deals);
    setObjectsCount(statistics.metrics.objects);
    setClientsCount(statistics.metrics.clients);
  }, [statistics]);

  const metricsData = [
    { name: "Сделки", value: dealsCount },
    { name: "Показы", value: viewsCount },
    { name: "Объекты", value: objectsCount },
    { name: "Клиенты", value: clientsCount },
  ];

  // Browser distribution data
  const browserData = [
    { browser: "Показы", visitors: viewsCount, fill: "var(--color-chrome)" },
    { browser: "Сделки", visitors: dealsCount, fill: "var(--color-firefox)" }, // Changed color
    {
      browser: "Объекты",
      visitors: objectsCount,
      fill: "var(--color-safari)", // Changed color
    },
    { browser: "Клиенты", visitors: clientsCount, fill: "var(--color-edge)" },
  ];

  // Device usage data
  const deviceData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  // Objects data for rent and sale in months
  const objectsData = [
    { month: "January", rent: 50, sale: 30 },
    { month: "February", rent: 70, sale: 40 },
    { month: "March", rent: 60, sale: 50 },
    { month: "April", rent: 80, sale: 60 },
    { month: "May", rent: 90, sale: 70 },
    { month: "June", rent: 100, sale: 80 },
  ];

  const browserConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };

  const deviceConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

  const totalBrowserVisitors = browserData.reduce(
    (acc, curr) => acc + curr.visitors,
    0
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const params: Record<string, string> = {
      action_type: actionType,
      responsible: responsible,
    };

    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    } else if (startDate) {
      params.date = startDate;
    }

    fetchData(params);
  }, [startDate, endDate, actionType, responsible, fetchData]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    localStorage.setItem("currentPage", "accounting");
  }, []);

  if (isSuperUserLoading) {
    return <Spinner theme="dark" />;
  }

  if (!isSuperUser) {
    return null;
  }

  // Update metrics data with actual values
  metricsData[0].value = statistics.metrics.deals;
  metricsData[1].value = statistics.metrics.views;
  metricsData[2].value = statistics.metrics.objects;
  metricsData[3].value = statistics.metrics.clients;

  const totalObjects = statistics.metrics.objects;

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setActionType("rent");
    setResponsible("");
    setShowMonthFilter(false);
    setShowTodayFilter(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад</span>
          </Button>
          <Button
            variant={showTodayFilter ? "default" : "outline"}
            className="w-[120px]"
            onClick={() => {
              setShowTodayFilter(true);
              setShowMonthFilter(false);
              const today = new Date();
              setStartDate(format(today, "yyyy-MM-dd"));
              setEndDate(format(today, "yyyy-MM-dd"));
            }}
          >
            Сегодня
          </Button>
          <Button
            variant={showMonthFilter ? "default" : "outline"}
            className="w-[120px]"
            onClick={() => {
              setShowMonthFilter(true);
              setShowTodayFilter(false);
              const today = new Date();
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
              );
              const lastDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
              );
              setStartDate(format(firstDayOfMonth, "yyyy-MM-dd"));
              setEndDate(format(lastDayOfMonth, "yyyy-MM-dd"));
            }}
          >
            Месяц
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] pl-3 text-left font-normal",
                  !startDate && !endDate && "text-muted-foreground"
                )}
                onClick={() => {
                  setShowMonthFilter(false);
                  setShowTodayFilter(false);
                }}
              >
                {startDate && endDate ? (
                  <>
                    {format(new Date(startDate), "dd.MM.yyyy")} -{" "}
                    {format(new Date(endDate), "dd.MM.yyyy")}
                  </>
                ) : (
                  <span>Выберите период</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: startDate ? new Date(startDate) : undefined,
                  to: endDate ? new Date(endDate) : undefined,
                }}
                onSelect={(range) => {
                  setStartDate(
                    range?.from ? format(range.from, "yyyy-MM-dd") : ""
                  );
                  setEndDate(range?.to ? format(range.to, "yyyy-MM-dd") : "");
                }}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Аренда</SelectItem>
              <SelectItem value="sale">Продажа</SelectItem>
            </SelectContent>
          </Select>

          <Select value={responsible} onValueChange={setResponsible}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите ответственного" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.full_name}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-[120px]"
            onClick={clearFilter}
          >
            Очистить фильтр
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Кол-во сделок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.transactions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Показы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.views}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доход</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.income}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Кол-во горячих клиентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.activeClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Кол-во холодных клиентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.coldClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Кол-во сохраненных объектов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.savedObjects}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего клиентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalClients}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Показатели</CardTitle>
            </CardHeader>
            <CardContent className="d-flex pb-0">
              <ChartContainer
                config={browserConfig}
                className="mx-auto aspect-square max-h-[350px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={browserData}
                    dataKey="visitors"
                    nameKey="browser"
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
                                {totalObjects.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Объекты
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <CardFooter className="flex justify-center gap-2 text-sm">
                {browserData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: data.fill }}
                      ></div>
                      <span>{data.browser}</span>
                    </div>
                    <span>{data.visitors.toLocaleString()}</span>
                  </div>
                ))}
              </CardFooter>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Обновлено: {statistics.lastUpdated ? format(new Date(statistics.lastUpdated), "dd.MM.yyyy") : "N/A"}
              </div>
              <div className="leading-none text-muted-foreground">
                Данные актуальны на {statistics.lastUpdated ? format(new Date(statistics.lastUpdated), "dd.MM.yyyy") : "N/A"}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Данные по объектам</CardTitle>
              <CardDescription>Январь - Июнь 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={deviceConfig}>
                <BarChart accessibilityLayer data={objectsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="rent" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="sale" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "var(--color-desktop)" }}
                ></div>
                Рост на 5.2% в этом месяце <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Показаны общие данные по объектам за последние 6 месяцев
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Производительность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <Progress value={statistics.performance} className="h-2" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {statistics.performance}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Метрики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metricsData.map((metric) => (
                  <div key={metric.name} className="flex items-center gap-2">
                    <div className="w-24 text-sm">{metric.name}</div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="w-12 text-sm text-right">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
