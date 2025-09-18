import { useState, useMemo } from "react";
import { History, Search, Play, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DetectionEvent {
  id: string;
  timestamp: Date;
  confidence: number;
  direction: number;
  duration: number;
  modelsActivated: number;
  audioSample?: string;
}

// Mock data
const mockDetections: DetectionEvent[] = Array.from({ length: 25 }, (_, i) => ({
  id: `detection-${i + 1}`,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
  confidence: 60 + Math.random() * 35,
  direction: Math.floor(Math.random() * 360),
  duration: Math.random() * 3 + 0.5,
  modelsActivated: Math.floor(Math.random() * 3) + 1,
  audioSample: `audio-sample-${i + 1}.wav`
})).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

export default function DetectionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDetections = useMemo(() => {
    return mockDetections.filter(detection => {
      const matchesSearch = searchTerm === "" || 
        detection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.timestamp.toLocaleDateString().includes(searchTerm);
      
      const matchesConfidence = confidenceFilter === "all" ||
        (confidenceFilter === "high" && detection.confidence >= 80) ||
        (confidenceFilter === "medium" && detection.confidence >= 65 && detection.confidence < 80) ||
        (confidenceFilter === "low" && detection.confidence < 65);
      
      const matchesDirection = directionFilter === "all" ||
        (directionFilter === "north" && (detection.direction >= 315 || detection.direction <= 45)) ||
        (directionFilter === "east" && detection.direction > 45 && detection.direction <= 135) ||
        (directionFilter === "south" && detection.direction > 135 && detection.direction <= 225) ||
        (directionFilter === "west" && detection.direction > 225 && detection.direction < 315);
      
      return matchesSearch && matchesConfidence && matchesDirection;
    });
  }, [searchTerm, confidenceFilter, directionFilter]);

  const paginatedDetections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDetections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDetections, currentPage]);

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge variant="destructive">High</Badge>;
    if (confidence >= 65) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const getDirectionLabel = (direction: number) => {
    if (direction >= 315 || direction <= 45) return "N";
    if (direction > 45 && direction <= 135) return "E";
    if (direction > 135 && direction <= 225) return "S";
    return "W";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detection History</h1>
          <p className="text-muted-foreground">Review and analyze past gunshot detection events</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDetections.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockDetections.filter(d => d.confidence >= 80).length}
            </div>
            <p className="text-xs text-muted-foreground">≥80% confidence</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockDetections.reduce((sum, d) => sum + d.direction, 0) / mockDetections.length)}°
            </div>
            <p className="text-xs text-muted-foreground">Most common: SE</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDetections.filter(d => 
                Date.now() - d.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High (&gt;=80%)</SelectItem>
                <SelectItem value="medium">Medium (65-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;65%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detection Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Detection Events ({filteredDetections.length} results)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Models</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDetections.map((detection) => (
                <TableRow key={detection.id}>
                  <TableCell className="font-mono text-sm">{detection.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{detection.timestamp.toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {detection.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getConfidenceBadge(detection.confidence)}
                      <span className="text-sm">{detection.confidence.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getDirectionLabel(detection.direction)}</Badge>
                      <span className="text-sm">{detection.direction}°</span>
                    </div>
                  </TableCell>
                  <TableCell>{detection.duration.toFixed(1)}s</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{detection.modelsActivated}/3</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Play
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDetections.length)} of {filteredDetections.length} results
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}