import { useState, useEffect } from "react";
import { Info, Cpu, MemoryStick, Thermometer, Wifi, HardDrive, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SystemMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  uptime: number;
  diskUsage: number;
}

interface ModelStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastUpdate: Date;
  accuracy: number;
}

export default function SystemInfo() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    temperature: 58,
    uptime: 142,
    diskUsage: 34
  });

  const [models] = useState<ModelStatus[]>([
    { name: "1D CNN Model", status: 'running', lastUpdate: new Date(), accuracy: 94.2 },
    { name: "2D CNN 64", status: 'running', lastUpdate: new Date(), accuracy: 91.8 },
    { name: "2D CNN 128", status: 'running', lastUpdate: new Date(), accuracy: 96.1 },
  ]);

  const [logs] = useState([
    { id: 1, timestamp: new Date(), level: 'info', message: 'System started successfully' },
    { id: 2, timestamp: new Date(Date.now() - 30000), level: 'info', message: 'Microphone array initialized' },
    { id: 3, timestamp: new Date(Date.now() - 60000), level: 'warning', message: 'High CPU usage detected' },
    { id: 4, timestamp: new Date(Date.now() - 120000), level: 'info', message: 'Model ensemble loaded' },
    { id: 5, timestamp: new Date(Date.now() - 180000), level: 'error', message: 'Temporary network timeout' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        temperature: Math.max(40, Math.min(80, prev.temperature + (Math.random() - 0.5) * 3)),
        uptime: prev.uptime + 1,
        diskUsage: prev.diskUsage
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-success text-success-foreground">Running</Badge>;
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Information</h1>
          <p className="text-muted-foreground">Hardware status and model performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-medium">Uptime: {formatUptime(metrics.uptime)}</span>
        </div>
      </div>

      <Tabs defaultValue="hardware" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hardware">Hardware Status</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="hardware" className="space-y-6">
          {/* Hardware Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metrics.cpu.toFixed(1)}%</div>
                <Progress value={metrics.cpu} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  ARM Cortex-A72 Quad Core
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <MemoryStick className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metrics.memory.toFixed(1)}%</div>
                <Progress value={metrics.memory} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {(metrics.memory * 8 / 100).toFixed(1)}GB / 8GB RAM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metrics.temperature.toFixed(1)}°C</div>
                <Progress 
                  value={(metrics.temperature - 30) / 50 * 100} 
                  className={`h-2 ${metrics.temperature > 70 ? '[&>div]:bg-destructive' : ''}`}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.temperature > 70 ? 'High temperature' : 'Normal range'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network</CardTitle>
                <Wifi className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">Connected</div>
                <div className="text-sm text-muted-foreground">
                  <div>WiFi: 5G Network</div>
                  <div>Signal: -45 dBm</div>
                  <div>Speed: 100 Mbps</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metrics.diskUsage}%</div>
                <Progress value={metrics.diskUsage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {(metrics.diskUsage * 64 / 100).toFixed(1)}GB / 64GB SD
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Microphones</CardTitle>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">4/4</div>
                <div className="text-sm text-muted-foreground">
                  <div>Array Status: Active</div>
                  <div>Sample Rate: 44.1 kHz</div>
                  <div>Bit Depth: 16-bit</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          {/* Model Status */}
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    {getStatusBadge(model.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Accuracy</p>
                      <div className="text-2xl font-bold text-success">{model.accuracy}%</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Last Update</p>
                      <div className="text-sm text-muted-foreground">
                        {model.lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Actions</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Restart</Button>
                        <Button variant="outline" size="sm">View Logs</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Model Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Performance metrics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* System Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent System Logs</CardTitle>
                <Button variant="outline" size="sm">Download Full Log</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getLogIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">{log.level}</span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}