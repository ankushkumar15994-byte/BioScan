import { Database, Image, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function DatasetInfo() {
  const datasets = [
    {
      name: "PlantVillage Dataset",
      images: "54,306",
      classes: "38",
      accuracy: "99.2",
      description: "Comprehensive dataset of healthy and diseased crop leaves",
      categories: ["Tomato", "Potato", "Pepper", "Grape", "Apple", "Corn"]
    },
    {
      name: "PlantDoc Dataset",
      images: "2,598",
      classes: "27",
      accuracy: "96.8",
      description: "Real-world images of plant diseases across multiple species",
      categories: ["Bean", "Rose", "Strawberry", "Wheat", "Cherry", "Peach"]
    },
    {
      name: "Crop Disease Dataset",
      images: "87,000+",
      classes: "58",
      accuracy: "97.5",
      description: "Large-scale agricultural disease detection dataset",
      categories: ["Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Soybean"]
    }
  ];

  const modelMetrics = [
    { metric: "Training Accuracy", value: 98.5 },
    { metric: "Validation Accuracy", value: 96.8 },
    { metric: "Precision", value: 97.2 },
    { metric: "Recall", value: 96.5 },
    { metric: "F1 Score", value: 96.8 }
  ];

  const trainingDetails = [
    { label: "Model Architecture", value: "ResNet-50 + Custom CNN" },
    { label: "Training Images", value: "143,904 images" },
    { label: "Disease Classes", value: "123 unique diseases" },
    { label: "Plant Species", value: "45+ species" },
    { label: "Training Time", value: "72 hours on GPU" },
    { label: "Framework", value: "TensorFlow & PyTorch" }
  ];

  return (
    <div className="w-full space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Database className="size-4" />
          <span className="text-sm font-medium">Training Data & Model Performance</span>
        </div>
        <h2 className="mb-4">World-Class Training Datasets</h2>
        <p className="text-muted-foreground">
          Our AI model is trained on the most comprehensive plant disease datasets,
          ensuring accurate detection across hundreds of plant species and disease types
        </p>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {datasets.map((dataset, index) => (
          <Card key={index} className="border-2">
            <CardHeader>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Database className="size-6 text-primary" />
              </div>
              <CardTitle>{dataset.name}</CardTitle>
              <CardDescription>{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Images</p>
                  <p className="text-2xl font-bold text-primary">{dataset.images}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Classes</p>
                  <p className="text-2xl font-bold text-primary">{dataset.classes}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{dataset.accuracy}%</span>
                </div>
                <Progress value={parseFloat(dataset.accuracy)} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {dataset.categories.map((cat, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Performance Metrics */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>
                Validated on 28,000+ test images across all disease categories
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {modelMetrics.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.metric}</p>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">{item.value}%</p>
                  <Progress value={item.value} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Specifications</CardTitle>
            <CardDescription>
              Technical details of our machine learning pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingDetails.map((detail, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className="text-sm font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Science Pipeline</CardTitle>
            <CardDescription>
              Our comprehensive ML workflow ensures optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Data Collection & Augmentation",
                "Preprocessing & Normalization",
                "Transfer Learning (ImageNet)",
                "Custom CNN Architecture",
                "Hyperparameter Optimization",
                "Cross-Validation Testing",
                "Model Ensemble & Deployment"
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Categories Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>Dataset Distribution by Category</CardTitle>
              <CardDescription>
                Balanced dataset ensuring robust performance across all plant types
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: "Fungal Diseases", count: "45,230", percentage: 31 },
              { category: "Bacterial Diseases", count: "32,450", percentage: 23 },
              { category: "Viral Diseases", count: "28,920", percentage: 20 },
              { category: "Nutrient Deficiency", count: "18,760", percentage: 13 },
              { category: "Pest Damage", count: "12,340", percentage: 9 },
              { category: "Environmental Stress", count: "6,204", percentage: 4 }
            ].map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                <p className="text-2xl font-bold mb-2">{item.count}</p>
                <Progress value={item.percentage} />
                <p className="text-xs text-muted-foreground mt-2">{item.percentage}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
