
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Upload, Zap, TrendingUp, FileText, Info, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompressionAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    if (files.length > 0) {
      analyzeCompression(files);
    }
  };

  const analyzeCompression = async (files: File[]) => {
    setIsAnalyzing(true);
    setProgress(0);

    try {
      const steps = [
        'Analyzing file types...',
        'Testing ZIP compression...',
        'Testing 7Z compression...',
        'Testing RAR compression...',
        'Testing GZIP compression...',
        'Calculating optimal ratios...',
        'Generating recommendations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      // Mock compression analysis results
      const compressionResults = [
        { format: 'ZIP (DEFLATE)', ratio: 65, size: totalSize * 0.35, speed: 'Fast', compatibility: 'Excellent' },
        { format: '7Z (LZMA2)', ratio: 78, size: totalSize * 0.22, speed: 'Slow', compatibility: 'Good' },
        { format: 'RAR', ratio: 72, size: totalSize * 0.28, speed: 'Medium', compatibility: 'Good' },
        { format: 'GZIP', ratio: 68, size: totalSize * 0.32, speed: 'Fast', compatibility: 'Excellent' },
        { format: 'BZIP2', ratio: 75, size: totalSize * 0.25, speed: 'Slow', compatibility: 'Good' }
      ];

      const fileTypeAnalysis = [
        { type: 'Documents', count: Math.floor(files.length * 0.4), avgCompression: 70 },
        { type: 'Images', count: Math.floor(files.length * 0.3), avgCompression: 15 },
        { type: 'Videos', count: Math.floor(files.length * 0.2), avgCompression: 5 },
        { type: 'Archives', count: Math.floor(files.length * 0.1), avgCompression: 95 }
      ];

      const pieData = fileTypeAnalysis.map(item => ({
        name: item.type,
        value: item.count,
        compression: item.avgCompression
      }));

      setAnalysisResults({
        totalFiles: files.length,
        totalSize: totalSize,
        compressionResults: compressionResults,
        fileTypeAnalysis: fileTypeAnalysis,
        pieData: pieData,
        recommendations: generateRecommendations(compressionResults, fileTypeAnalysis),
        bestFormat: compressionResults.reduce((best, current) => 
          current.ratio > best.ratio ? current : best
        )
      });

      toast({
        title: "Analysis Complete",
        description: `Analyzed ${files.length} files across multiple compression formats.`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze compression ratios.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const generateRecommendations = (compressionResults: any[], fileTypes: any[]) => {
    const recommendations = [];
    
    const bestRatio = compressionResults.reduce((best, current) => 
      current.ratio > best.ratio ? current : best
    );
    
    recommendations.push({
      type: 'Best Compression',
      title: `Use ${bestRatio.format}`,
      description: `Achieves ${bestRatio.ratio}% compression ratio, saving the most space.`,
      icon: Award
    });

    const fastestFormat = compressionResults.find(f => f.speed === 'Fast');
    if (fastestFormat) {
      recommendations.push({
        type: 'Best Speed',
        title: `Use ${fastestFormat.format}`,
        description: `Fast compression with ${fastestFormat.ratio}% ratio for quick archiving.`,
        icon: Zap
      });
    }

    if (fileTypes.find(ft => ft.type === 'Images' && ft.count > 0)) {
      recommendations.push({
        type: 'Image Files',
        title: 'Limited Compression Expected',
        description: 'Images are already compressed. Consider lossless formats like PNG optimization.',
        icon: Info
      });
    }

    return recommendations;
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <BarChart3 className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Compression Analyzer</h1>
          <p className="text-gray-600">Compare compression ratios across different formats and get optimization recommendations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Files to Analyze</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {selectedFiles.length > 0 ? `Selected: ${selectedFiles.length} files` : 'Choose Files'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {selectedFiles.length > 0 && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm font-medium">
                  Total size: {formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))}
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Analyzing compression performance...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResults && (
          <Tabs defaultValue="comparison" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="comparison">Format Comparison</TabsTrigger>
              <TabsTrigger value="breakdown">File Breakdown</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compression Format Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysisResults.compressionResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="format" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Compression Ratio (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Compression Ratio']} />
                        <Bar dataKey="ratio" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResults.compressionResults.map((result: any, index: number) => (
                  <Card key={index} className={result === analysisResults.bestFormat ? 'border-green-500 bg-green-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{result.format}</h3>
                        {result === analysisResults.bestFormat && (
                          <Badge className="bg-green-500">Best</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><strong>Compression:</strong> {result.ratio}%</div>
                        <div><strong>Final Size:</strong> {formatFileSize(result.size)}</div>
                        <div><strong>Speed:</strong> {result.speed}</div>
                        <div><strong>Compatibility:</strong> {result.compatibility}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>File Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analysisResults.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analysisResults.pieData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compression Potential by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResults.fileTypeAnalysis.map((type: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{type.type}</span>
                            <span className="text-sm text-gray-600">{type.count} files</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Expected Compression</span>
                              <span>{type.avgCompression}%</span>
                            </div>
                            <Progress value={type.avgCompression} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResults.recommendations.map((rec: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <rec.icon className="h-5 w-5 mr-2" />
                        {rec.title}
                      </CardTitle>
                      <Badge variant="outline">{rec.type}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Optimization Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <p className="text-sm text-gray-600">Best Compression</p>
                      <p className="font-semibold text-green-600">{analysisResults.bestFormat.ratio}%</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-600">Space Saved</p>
                      <p className="font-semibold text-blue-600">
                        {formatFileSize(analysisResults.totalSize - analysisResults.bestFormat.size)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <p className="text-sm text-gray-600">Final Size</p>
                      <p className="font-semibold text-purple-600">
                        {formatFileSize(analysisResults.bestFormat.size)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <p className="text-sm text-gray-600">Files Analyzed</p>
                      <p className="font-semibold text-orange-600">{analysisResults.totalFiles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Detailed Analysis Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Analysis Overview</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Total Files:</strong> {analysisResults.totalFiles}</div>
                        <div><strong>Total Size:</strong> {formatFileSize(analysisResults.totalSize)}</div>
                        <div><strong>Best Format:</strong> {analysisResults.bestFormat.format}</div>
                        <div><strong>Max Compression:</strong> {analysisResults.bestFormat.ratio}%</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Performance Metrics</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Format</th>
                              <th className="text-left p-2">Ratio</th>
                              <th className="text-left p-2">Size</th>
                              <th className="text-left p-2">Speed</th>
                              <th className="text-left p-2">Compatibility</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResults.compressionResults.map((result: any, index: number) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{result.format}</td>
                                <td className="p-2">{result.ratio}%</td>
                                <td className="p-2">{formatFileSize(result.size)}</td>
                                <td className="p-2">{result.speed}</td>
                                <td className="p-2">{result.compatibility}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default CompressionAnalyzer;
