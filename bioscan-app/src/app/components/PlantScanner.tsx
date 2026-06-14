import { useState, useRef, useEffect } from "react";
import { Upload, Camera, X, Loader2, ScanLine } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ScanResult {
  disease: string;
  confidence: number;
  severity: string;
  description: string;
  treatment: string;
}

export function PlantScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const diseases = [
    {
      disease: "Leaf Blight",
      confidence: 94.5,
      severity: "Moderate",
      description: "A fungal infection causing brown spots and lesions on leaves. Common in humid conditions.",
      treatment: "Remove infected leaves, apply fungicide, improve air circulation, and reduce overhead watering."
    },
    {
      disease: "Powdery Mildew",
      confidence: 87.2,
      severity: "Mild",
      description: "White powdery fungal growth on leaf surfaces, typically appearing in warm, dry conditions.",
      treatment: "Apply sulfur-based fungicide, increase spacing between plants, and ensure adequate sunlight."
    },
    {
      disease: "Bacterial Spot",
      confidence: 91.8,
      severity: "Severe",
      description: "Dark spots with yellow halos caused by bacterial infection, spreads rapidly in wet weather.",
      treatment: "Remove infected plants, use copper-based bactericides, avoid overhead irrigation, and practice crop rotation."
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
          setResult(randomDisease);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setScanProgress(0);
    setIsScanning(false);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback to file input
        fileInputRef.current?.click();
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      setIsCameraMode(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback to file input instead of showing error
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraMode(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Upload Plant Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedImage && !isCameraMode ? (
          <div className="flex flex-col gap-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button variant="outline" className="w-full" onClick={startCamera}>
              <Camera className="mr-2 size-4" />
              Use Camera
            </Button>
          </div>
        ) : isCameraMode ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              {/* Scanning Animation Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-primary animate-pulse" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-primary animate-pulse" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-primary animate-pulse" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-primary animate-pulse" />

                {/* Scanning Line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-primary/20" />
                    ))}
                  </div>
                </div>

                {/* Center Focus Box */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary/60 rounded-lg animate-pulse">
                    <ScanLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-primary animate-pulse" />
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={stopCamera}
              >
                <X className="size-4" />
              </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={capturePhoto}>
                <Camera className="mr-2 size-4" />
                Capture Photo
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-64 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleReset}
              >
                <X className="size-4" />
              </Button>
            </div>

            {!result && !isScanning && (
              <Button className="w-full" onClick={handleScan}>
                Scan for Diseases
              </Button>
            )}

            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </div>
                <Progress value={scanProgress} />
              </div>
            )}

            {result && (
              <div className="space-y-4 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{result.disease}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.severity === "Severe" ? "bg-destructive/20 text-destructive" :
                    result.severity === "Moderate" ? "bg-chart-1/20 text-chart-1" :
                    "bg-chart-2/20 text-chart-2"
                  }`}>
                    {result.severity}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="font-medium text-sm mb-1">Recommended Treatment:</p>
                    <p className="text-sm text-muted-foreground">{result.treatment}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                  Scan Another Plant
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
