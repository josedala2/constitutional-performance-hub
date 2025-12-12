import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "accent";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-institutional",
        variant === "primary" && "gradient-institutional text-primary-foreground",
        variant === "accent" && "gradient-gold text-accent-foreground",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "default" ? "text-muted-foreground" : "opacity-90"
              )}
            >
              {title}
            </p>
            <p className="text-3xl font-serif font-bold">{value}</p>
            {subtitle && (
              <p
                className={cn(
                  "text-sm",
                  variant === "default" ? "text-muted-foreground" : "opacity-80"
                )}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.positive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.positive ? "+" : "-"}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs. período anterior</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "rounded-lg p-3",
              variant === "default"
                ? "bg-secondary text-secondary-foreground"
                : "bg-white/20"
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
