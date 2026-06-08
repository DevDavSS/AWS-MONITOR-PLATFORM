import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface ResourceCardProps {
  title: string;
  value: number;
}

export default function ResourceCard({
  title,
  value,
}: ResourceCardProps) {
  return (
    <Card className="h-48">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center h-full">
        <span className="text-5xl font-bold">
          {value}
        </span>
      </CardContent>
    </Card>
  );
}