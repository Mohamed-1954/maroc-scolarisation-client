import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  id: number;
  title: string;
  value: string;
  percentageChange: number;
  footerText: string;
  footerContext?: string;
}

const statsData: StatCardProps[] = [
  {
    id: 1,
    title: "Total des dons",
    value: "120,000 MAD",
    percentageChange: 12,
    footerText: "Hausse par rapport au mois dernier",
    footerContext: "Basé sur les contributions mensuelles",
  },
  {
    id: 2,
    title: "Donateurs Actifs",
    value: "45",
    percentageChange: 8,
    footerText: "Augmentation des nouveaux donateurs",
    footerContext: "Comparé à la période précédente",
  },
  {
    id: 3,
    title: "Élèves Soutenus",
    value: "78",
    percentageChange: 15,
    footerText: "Plus d'élèves bénéficiaires",
    footerContext: "Grâce aux contributions récentes",
  },
  {
    id: 4,
    title: "Dépenses Engagées",
    value: "85,500 MAD",
    percentageChange: -5,
    footerText: "Baisse par rapport au mois dernier",
    footerContext: "Optimisation des coûts en cours",
  },
];

export function StatCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs xl:grid-cols-4 md:grid-cols-2 grid grid-cols-1 gap-4">
      {statsData.map((stat) => {
        const isPositive = stat.percentageChange >= 0;
        const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;
        const percentageString = `${isPositive ? '+' : ''}${stat.percentageChange}%`;

        return (
          <Card  key={stat.id} className="@container/card">
            <CardHeader className="relative">
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {stat.value}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  <TrendIcon className="size-3" />
                  {percentageString}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
              <div className="line-clamp-1 flex items-center gap-2 font-medium">
                {stat.footerText} <TrendIcon className="size-4" />
              </div>
              {stat.footerContext && (
                <div className="text-muted-foreground">{stat.footerContext}</div>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}