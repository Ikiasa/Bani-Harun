import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    description: string
    icon: LucideIcon
    trend?: {
        value: number
        positive: boolean
    }
    className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
    return (
        <div className={cn("p-6 bg-card border rounded-xl shadow-sm grid gap-4", className)}>
            <div className="grid grid-cols-[1fr_auto] items-center">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="grid">
                <span className="text-2xl font-bold">{value}</span>
                <div className="grid grid-flow-col justify-start items-center gap-1.5 mt-1">
                    {trend && (
                        <span className={cn(
                            "text-xs font-medium",
                            trend.positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                        )}>
                            {trend.positive ? "+" : "-"}{trend.value}%
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground">{description}</span>
                </div>
            </div>
        </div>
    )
}
