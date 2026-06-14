import { Leaf, ArrowRight, Brain } from "lucide-react";
import { Button } from "./components/ui/button";
import { PlantScanner } from "./components/PlantScanner";
import { DiseaseGallery } from "./components/DiseaseGallery";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { DatasetInfo } from "./components/DatasetInfo";

export default function App() {
  const scrollToScanner = () => {
    document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold">PlantBioScan</h1>
              <p className="text-xs text-muted-foreground">AI Disease Detection</p>
            </div>
          </div>
          <Button onClick={scrollToScanner}>
            Start Scanning
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Brain className="size-4" />
            <span className="text-sm font-medium">AI-Powered Plant Health Analysis</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Detect Plant Diseases <br />
            <span className="text-primary">Using Advanced AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload a photo of your plant and get instant AI-powered disease detection,
            analysis, and treatment recommendations powered by machine learning and data science.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={scrollToScanner}>
              Scan Your Plant Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Learn More
            </Button>
          </div>
          <Stats />
        </div>
      </section>

      {/* Scanner Section */}
      <section id="scanner" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-center mb-12 max-w-2xl">
              <h2 className="mb-4">Start Your Plant Health Scan</h2>
              <p className="text-muted-foreground">
                Our AI model analyzes leaf patterns, discoloration, and disease markers
                to provide accurate diagnosis and treatment recommendations
              </p>
            </div>
            <PlantScanner />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Features />
        </div>
      </section>

      {/* Disease Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <DiseaseGallery />
        </div>
      </section>

      {/* Dataset & Training Information */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <DatasetInfo />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <Leaf className="size-5 text-primary-foreground" />
                </div>
                <span className="font-bold">PlantBioScan</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI-powered plant disease detection using machine learning and data science.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Deep Learning Models</li>
                <li>Computer Vision</li>
                <li>Neural Networks</li>
                <li>Data Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Disease Database</li>
                <li>Treatment Guide</li>
                <li>Research Papers</li>
                <li>API Documentation</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 PlantBioScan. Powered by AI, Machine Learning & Data Science.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}