import { useState, useEffect } from "react";
import { Activity, Zap, Target, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ModelPrediction {
  name: string;
  confidence: number;
  status: 'active' | 'inactive';
  lastUpdate: Date;
}

export default function LiveMonitor() {
  const [models, setModels] = useState<ModelPrediction[]>([
    { name: "1D CNN Model", confidence: 15, status: 'active', lastUpdate: new Date() },
    { name: "2D CNN 64", confidence: 23, status: 'active', lastUpdate: new Date() },
    { name: "2D CNN 128", confidence: 18, status: 'active', lastUpdate: new Date() },
  ]);
  
  const [ensembleScore, setEnsembleScore] = useState(0);
  const [activatedModels, setActivatedModels] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate model predictions
      const updatedModels = models.map(model => ({
        ...model,
        confidence: Math.random() * 100,
        lastUpdate: new Date(),
      }));
      
      setModels(updatedModels);
      
      // Calculate ensemble
      const activated = updatedModels.filter(m => m.confidence >= 50).length;
      setActivatedModels(activated);
      setEnsembleScore(activated >= 2 ? 85 + Math.random() * 10 : Math.random() * 30);
    }, 1000);

    return () => clearInterval(interval);
  }, [models]);

  const isAlert = activatedModels >= 2;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Monitor</h1>
          <p className="text-muted-foreground">Real-time model predictions and confidence levels</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Feed Active</span>
        </div>
      </div>

      {/* Ensemble Status */}
      <Card className={isAlert ? "border-destructive bg-destructive/5" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Ensemble Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${isAlert ? 'text-destructive' : 'text-success'}`}>
                {activatedModels}/3
              </div>
              <p className="text-sm text-muted-foreground">Models Activated</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${isAlert ? 'text-destructive' : 'text-muted-foreground'}`}>
                {ensembleScore.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Ensemble Confidence</p>
            </div>
            <div className="text-center">
              <Badge variant={isAlert ? "destructive" : "secondary"} className="text-lg px-4 py-2">
                {isAlert ? "GUNSHOT DETECTED" : "CLEAR"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Model Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model, index) => (
          <Card key={model.name} className={model.confidence >= 50 ? "border-warning bg-warning/5" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {model.name}
                <Badge variant={model.confidence >= 50 ? "destructive" : "secondary"}>
                  {model.confidence >= 50 ? "ACTIVATED" : "MONITORING"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence</span>
                    <span className="font-medium">{model.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={model.confidence} 
                    className={`h-2 ${model.confidence >= 50 ? '[&>div]:bg-destructive' : ''}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated: {model.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detection Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Detection Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Individual Model Threshold</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Minimum Confidence</span>
                  <span className="font-medium">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Ensemble Voting</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Required Activated Models</span>
                  <span className="font-medium">2/3</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i}
                      className={`flex-1 h-2 rounded ${activatedModels >= i ? 'bg-destructive' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Audio Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Audio Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {(Math.random() * 0.5 + 0.1).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Volume Level</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {(Math.random() * 2000 + 1000).toFixed(0)} Hz
              </div>
              <p className="text-sm text-muted-foreground">Dominant Freq</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {(Math.random() * 50 + 10).toFixed(0)}
              </div>
              <p className="text-sm text-muted-foreground">Sharp Changes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}