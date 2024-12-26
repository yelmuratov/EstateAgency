import { IChangeLog } from "@/types/property"
import { Card, CardContent } from "@/components/ui/card"

interface ExpandedRowProps {
  property: IChangeLog
}

export function ExpandedRow({ property }: ExpandedRowProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ru-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    }).format(new Date(dateString))
  }

  // Function to format different types of values
  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return "—"

    switch (key) {
      case 'price':
      case 'agent_commission':
      case 'second_agent_commission':
        return new Intl.NumberFormat("ru-UZ", {
          style: "currency",
          currency: "UZS",
        }).format(Number(value))
      case 'agent_percent':
      case 'second_agent_percent':
        return `${value}%`
      case 'furnished':
      case 'parking_place':
      case 'deal':
        return Boolean(value) ? "Да" : "Нет"
      case 'created_at':
      case 'updated_at':
        return formatDate(String(value))
      default:
        return String(value)
    }
  }

  // Function to get changed fields between before and after data
  const getChangedFields = () => {
    if (property.operation !== "UPDATE" || !property.before_data) {
      return property.after_data ? Object.entries(property.after_data).map(([key, value]) => ({
        key,
        before: null,
        after: value
      }))
      : []
    }

    const changes: Array<{ key: string; before: unknown; after: unknown }> = []
    const beforeData = property.before_data
    const afterData = property.after_data

    if (afterData) {
      Object.keys(afterData).forEach(key => {
        if (JSON.stringify(beforeData[key as keyof typeof beforeData]) !== 
            JSON.stringify(afterData[key as keyof typeof afterData])) {
          changes.push({
            key,
            before: beforeData[key as keyof typeof beforeData],
            after: afterData[key as keyof typeof afterData]
          })
        }
      })
    }

    return changes
  }

  const changedFields = getChangedFields()

  if (property.operation === "UPDATE") {
    return (
      <div className="p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Предыдущие данные</h3>
              <div className="space-y-3">
                {changedFields.map(({ key, before }) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">{key}:</div>
                    <div className="text-sm text-muted-foreground">
                      {formatValue(key, before)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Новые данные</h3>
              <div className="space-y-3">
                {changedFields.map(({ key, after }) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">{key}:</div>
                    <div className="text-sm text-muted-foreground">
                      {formatValue(key, after)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // For non-UPDATE operations, show the existing view
  return (
    <div className="p-4 bg-muted/50">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.after_data && Object.entries(property.after_data).map(([key, value]) => (
              <div key={key}>
                <h4 className="font-medium text-sm">{key}</h4>
                <div className="text-sm text-muted-foreground">
                  {formatValue(key, value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

