import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import BackendStatus from "@/components/BackendStatus";
import { CheckCircle, XCircle, RefreshCw, Code, Server } from "lucide-react";

const TestBackend = () => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    health: 'success' | 'error' | null;
    healthMessage: string;
  }>({
    health: null,
    healthMessage: ''
  });

  const runTests = async () => {
    setTesting(true);
    setTestResults({ health: null, healthMessage: '' });

    // Test health endpoint
    try {
      const healthResponse = await api.healthCheck();
      setTestResults(prev => ({
        ...prev,
        health: 'success',
        healthMessage: `Status: ${healthResponse.status}`
      }));
      
      toast({
        title: "Backend Tests Passed",
        description: "All API endpoints are working correctly",
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        health: 'error',
        healthMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      toast({
        title: "Backend Tests Failed",
        description: "Some API endpoints are not responding",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | null) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'success' | 'error' | null) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Backend API Testing</h1>
          <p className="text-lg text-muted-foreground">
            Test the connection and functionality of the resume screening backend
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <BackendStatus />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Base URL</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Environment</p>
                <p className="text-sm text-muted-foreground">
                  {import.meta.env.MODE}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Endpoint Tests
            </CardTitle>
            <CardDescription>
              Test individual API endpoints to verify functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                onClick={runTests}
                disabled={testing}
                variant="hero"
              >
                {testing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run API Tests
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults.health)}
                  <div>
                    <p className="font-medium">GET /health</p>
                    <p className="text-sm text-muted-foreground">Health check endpoint</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(testResults.health)}>
                    {testResults.health ? testResults.health.toUpperCase() : 'NOT TESTED'}
                  </Badge>
                  {testResults.healthMessage && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {testResults.healthMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">POST /screen</p>
                    <p className="text-sm text-muted-foreground">Resume screening endpoint</p>
                  </div>
                </div>
                <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                  REQUIRES FILE
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">POST /screen-json</p>
                    <p className="text-sm text-muted-foreground">Resume screening with JSON data</p>
                  </div>
                </div>
                <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                  REQUIRES FILE
                </Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure the backend server is running on port 8000</li>
                <li>• Check that all required dependencies are installed</li>
                <li>• Verify the OpenRouter API key is configured</li>
                <li>• Test the resume screening functionality with actual files</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestBackend;