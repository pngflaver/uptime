import React from 'react';
import type { Node } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PingChart from './ping-chart';

interface NodeCardProps {
  node: Node;
  onRemove: (id: string) => void;
}

const StatusIndicator: React.FC<{ status: Node['status'] }> = ({ status }) => {
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    pending: 'bg-yellow-500 animate-pulse',
  };
  const statusText = {
    online: 'Online',
    offline: 'Offline',
    pending: 'Pending...',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-3 w-3 rounded-full', statusClasses[status])} />
      <span className="text-sm font-medium capitalize text-muted-foreground">{statusText[status]}</span>
    </div>
  );
};

const NodeCard: React.FC<NodeCardProps> = ({ node, onRemove }) => {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline break-all">{node.name}</CardTitle>
          <CardDescription>
            <StatusIndicator status={node.status} />
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRemove(node.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remove Node</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <PingChart data={node.pingHistory} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Latency:{' '}
          <span className="font-bold text-foreground">
            {node.status === 'online' && node.latency !== null ? `${node.latency} ms` : 'N/A'}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Uptime:{' '}
          <span className="font-bold text-foreground">
            {node.uptime.toFixed(2)}%
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default NodeCard;
