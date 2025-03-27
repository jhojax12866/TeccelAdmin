import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  content: string;
}

export default function InfoCard({ icon, title, description, content }: InfoCardProps) {
  return (
    <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-red-100 p-4 rounded-full">{icon}</div>
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}
