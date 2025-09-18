import { useState } from "react";
import { Settings as SettingsIcon, Save, TestTube, Mail, Phone, Mic, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Detection Settings
    confidenceThreshold: [50],
    ensembleVoting: 2,
    alertCooldown: [10],
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    emailRecipients: "security@company.com",
    phoneNumbers: "+1234567890",
    
    // Microphone Settings
    microphoneGain: [75],
    sampleRate: 44100,
    bufferSize: 1024,
    microphoneCount: 4,
    
    // UI Settings
    radarTheme: "default",
    alertVolume: [80],
    autoRefresh: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleTest = (type: string) => {
    toast({
      title: `${type} Test`,
      description: `Testing ${type.toLowerCase()} configuration...`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure detection parameters and notifications</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      {/* Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Detection Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Confidence Threshold: {settings.confidenceThreshold[0]}%</Label>
              <Slider
                value={settings.confidenceThreshold}
                onValueChange={(value) => setSettings(prev => ({ ...prev, confidenceThreshold: value }))}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Minimum confidence required for individual models to activate
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Ensemble Voting Requirement</Label>
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    variant={settings.ensembleVoting === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, ensembleVoting: num }))}
                  >
                    {num}/3 Models
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Number of models that must agree for positive detection
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Alert Cooldown: {settings.alertCooldown[0]} seconds</Label>
            <Slider
              value={settings.alertCooldown}
              onValueChange={(value) => setSettings(prev => ({ ...prev, alertCooldown: value }))}
              max={60}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Minimum time between consecutive alerts to prevent spam
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Alert Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              
              {settings.emailNotifications && (
                <div className="space-y-2">
                  <Label>Email Recipients</Label>
                  <Textarea
                    value={settings.emailRecipients}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailRecipients: e.target.value }))}
                    placeholder="Enter email addresses, separated by commas"
                    rows={3}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleTest("Email")}>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              
              {settings.smsNotifications && (
                <div className="space-y-2">
                  <Label>Phone Numbers</Label>
                  <Textarea
                    value={settings.phoneNumbers}
                    onChange={(e) => setSettings(prev => ({ ...prev, phoneNumbers: e.target.value }))}
                    placeholder="Enter phone numbers, separated by commas"
                    rows={3}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleTest("SMS")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Test SMS
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Microphone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Microphone Array Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Microphone Gain: {settings.microphoneGain[0]}%</Label>
                <Slider
                  value={settings.microphoneGain}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, microphoneGain: value }))}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sample Rate</Label>
                <Input
                  type="number"
                  value={settings.sampleRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, sampleRate: Number(e.target.value) }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Buffer Size</Label>
                <Input
                  type="number"
                  value={settings.bufferSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, bufferSize: Number(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Active Microphones</Label>
                <Input
                  type="number"
                  value={settings.microphoneCount}
                  onChange={(e) => setSettings(prev => ({ ...prev, microphoneCount: Number(e.target.value) }))}
                  min={1}
                  max={8}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleTest("Microphone")}>
              <TestTube className="h-4 w-4 mr-2" />
              Test Microphones
            </Button>
            <Button variant="outline" onClick={() => handleTest("Calibration")}>
              Calibrate Array
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* UI Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Interface Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Alert Volume: {settings.alertVolume[0]}%</Label>
                <Slider
                  value={settings.alertVolume}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, alertVolume: value }))}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-refresh Dashboard</Label>
                  <p className="text-sm text-muted-foreground">Update data automatically</p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefresh: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Radar Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.radarTheme === "default" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, radarTheme: "default" }))}
                  >
                    Default
                  </Button>
                  <Button
                    variant={settings.radarTheme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, radarTheme: "dark" }))}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={settings.radarTheme === "tactical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, radarTheme: "tactical" }))}
                  >
                    Tactical
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}