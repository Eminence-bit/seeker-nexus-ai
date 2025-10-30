import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    try {
      await api.healthCheck();
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'checking':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Backend API Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">
              {status === 'online' ? 'Connected' : status === 'offline' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
          <Badge className={getStatusColor()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        {lastChecked && (
          <p className="text-sm text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkBackendStatus}
          disabled={status === 'checking'}
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
          Check Status
        </Button>
      </CardContent>
    </Card>
  );
};

export default BackendStatus;