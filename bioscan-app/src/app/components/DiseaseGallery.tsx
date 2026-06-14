import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Disease {
  name: string;
  scientificName: string;
  imageUrl: string;
  affectedPlants: string[];
  symptoms: string[];
}

export function DiseaseGallery() {
  const diseases: Disease[] = [
    {
      name: "Leaf Blight",
      scientificName: "Alternaria solani",
      imageUrl: "https://images.unsplash.com/photo-1692481060581-98c224124f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Tomato", "Potato", "Eggplant"],
      symptoms: ["Brown spots", "Concentric rings", "Leaf yellowing"]
    },
    {
      name: "Powdery Mildew",
      scientificName: "Erysiphe cichoracearum",
      imageUrl: "https://images.unsplash.com/photo-1604481986614-e48521951d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Cucurbits", "Roses", "Grapes"],
      symptoms: ["White powder", "Leaf curling", "Stunted growth"]
    },
    {
      name: "Bacterial Spot",
      scientificName: "Xanthomonas campestris",
      imageUrl: "https://images.unsplash.com/photo-1692481061201-5767c19396af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Pepper", "Tomato", "Peach"],
      symptoms: ["Dark spots", "Yellow halos", "Leaf drop"]
    },
    {
      name: "Rust Disease",
      scientificName: "Puccinia spp.",
      imageUrl: "https://images.unsplash.com/photo-1620055494738-248ba57ed714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Wheat", "Beans", "Roses"],
      symptoms: ["Orange pustules", "Leaf discoloration", "Premature defoliation"]
    },
    {
      name: "Anthracnose",
      scientificName: "Colletotrichum spp.",
      imageUrl: "https://images.unsplash.com/photo-1649088311431-9ffe92a4d4a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Mango", "Bean", "Strawberry"],
      symptoms: ["Sunken lesions", "Dark spots", "Fruit rot"]
    },
    {
      name: "Mosaic Virus",
      scientificName: "TMV/CMV",
      imageUrl: "https://images.unsplash.com/photo-1704896602951-0f038b6da1d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      affectedPlants: ["Tobacco", "Cucumber", "Tomato"],
      symptoms: ["Mottled leaves", "Distorted growth", "Reduced yield"]
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="mb-2">Common Plant Diseases</h2>
        <p className="text-muted-foreground">
          Learn to identify and treat common plant diseases
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diseases.map((disease, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={disease.imageUrl}
                alt={disease.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle>{disease.name}</CardTitle>
              <CardDescription className="italic">{disease.scientificName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Affected Plants:</p>
                <div className="flex flex-wrap gap-1">
                  {disease.affectedPlants.map((plant, i) => (
                    <Badge key={i} variant="secondary">{plant}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Common Symptoms:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {disease.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-primary" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
