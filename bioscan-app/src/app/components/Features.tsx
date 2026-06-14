import { Brain, Zap, Shield, LineChart, Database, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning models trained on thousands of plant disease images for accurate diagnosis"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get results in seconds with our optimized neural network architecture"
    },
    {
      icon: Shield,
      title: "95%+ Accuracy",
      description: "State-of-the-art deep learning models achieving professional-grade accuracy"
    },
    {
      icon: LineChart,
      title: "Data Science Insights",
      description: "Comprehensive analytics and trend analysis to track disease patterns over time"
    },
    {
      icon: Database,
      title: "Extensive Database",
      description: "Access to a vast database of plant diseases, treatments, and prevention strategies"
    },
    {
      icon: Leaf,
      title: "Multiple Species",
      description: "Support for hundreds of plant species from crops to ornamentals"
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="mb-2">Powered by AI & Data Science</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our advanced machine learning platform combines computer vision, deep learning,
          and comprehensive botanical databases to deliver professional-grade plant disease detection
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="size-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
