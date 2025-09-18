import { useState, useEffect } from "react";
import { Shield, Mic, Clock, AlertTriangle, CheckCircle, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import RadarIndicator from "@/components/RadarIndicator";
import AudioWaveform from "@/components/AudioWaveform";

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  direction: number;
  type: 'gunshot' | 'clear';
}

export default function Dashboard() {
  const [currentStatus, setCurrentStatus] = useState<'safe' | 'alert'>('safe');
  const [lastProcessed, setLastProcessed] = useState(new Date());
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [microphoneStatus, setMicrophoneStatus] = useState<'connected' | 'disconnected'>('connected');
  const [detectionDirection, setDetectionDirection] = useState<number | null>(null);

  // Mock detection simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastProcessed(new Date());
      
      // 5% chance of gunshot detection
      if (Math.random() < 0.05) {
        const detection: Detection = {
          id: Date.now().toString(),
          timestamp: new Date(),
          confidence: 60 + Math.random() * 35, // 60-95%
          direction: Math.floor(Math.random() * 360),
          type: 'gunshot'
        };
        
        setCurrentStatus('alert');
        setDetectionDirection(detection.direction);
        setRecentDetections(prev => [detection, ...prev.slice(0, 4)]);
        
        toast({
          title: "⚠️ GUNSHOT DETECTED!",
          description: `Direction: ${detection.direction}° | Confidence: ${detection.confidence.toFixed(1)}%`,
          variant: "destructive",
        });

        // Reset to safe after 10 seconds
        setTimeout(() => {
          setCurrentStatus('safe');
          setDetectionDirection(null);
        }, 10000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${currentStatus === 'safe' ? 'bg-success animate-pulse' : 'bg-destructive animate-pulse'}`} />
              <span className={`font-semibold ${currentStatus === 'safe' ? 'text-success' : 'text-destructive'}`}>
                {currentStatus === 'safe' ? 'SECURE' : 'ALERT'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Microphone Array</CardTitle>
            <Mic className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${microphoneStatus === 'connected' ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
              <span className="font-medium capitalize">{microphoneStatus}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">4 channels active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Processed</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {lastProcessed.toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((Date.now() - lastProcessed.getTime()) / 1000)}s ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDetections.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Alert Display */}
      <Card className={`${currentStatus === 'alert' ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStatus === 'alert' ? (
              <>
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <span className="text-destructive">GUNSHOT DETECTED!</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 text-success" />
                <span className="text-success">No Threats Detected</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className={`text-6xl font-bold mb-4 ${currentStatus === 'alert' ? 'text-destructive' : 'text-success'}`}>
              {currentStatus === 'alert' ? '⚠️' : '✅'}
            </div>
            <p className="text-lg text-muted-foreground">
              {currentStatus === 'alert' 
                ? 'Emergency protocols activated. Authorities notified.' 
                : 'All systems operational. Continuous monitoring active.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Radar and Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Direction Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadarIndicator 
              detectionAngle={detectionDirection} 
              isAlert={currentStatus === 'alert'} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AudioWaveform isActive={currentStatus === 'alert'} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Detections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Detection Events</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDetections.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent detections</p>
          ) : (
            <div className="space-y-3">
              {recentDetections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Gunshot Detected</p>
                      <p className="text-sm text-muted-foreground">
                        {detection.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-1">
                      {detection.confidence.toFixed(1)}% confidence
                    </Badge>
                    <p className="text-sm text-muted-foreground">Direction: {detection.direction}°</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}