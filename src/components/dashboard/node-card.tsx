import React from 'react';
import type { Node } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import PingChart from './ping-chart';
import { formatDistanceStrict } from 'date-fns';

interface NodeCardProps {
  node: Node;
  onRemove: (id: string) => void;
  onEdit: (node: Node) => void;
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

const UptimeStatus: React.FC<{ node: Node }> = ({ node }) => {
    const [currentTime, setCurrentTime] = React.useState(Date.now());
  
    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  
    if (node.status === 'pending') {
      return (
        <p className="text-sm text-muted-foreground">
          Uptime: <span className="font-bold text-foreground">N/A</span>
        </p>
      );
    }
  
    const duration = formatDistanceStrict(new Date(node.lastStatusChange), currentTime, {
      addSuffix: false,
    });
  
    const label = node.status === 'online' ? 'Up for' : 'Down for';
  
    return (
      <p className="text-sm text-muted-foreground">
        {label}: <span className="font-bold text-foreground">{duration}</span>
      </p>
    );
  };

const NodeCard: React.FC<NodeCardProps> = ({ node, onRemove, onEdit }) => {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex-1 min-w-0">
          <CardTitle className="font-headline truncate" title={node.displayName}>{node.displayName}</CardTitle>
          <CardDescription className="truncate" title={node.name}>{node.name}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(node)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Node</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRemove(node.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remove Node</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <StatusIndicator status={node.status} />
        <div className='h-[150px] w-full mt-2'>
            <PingChart data={node.pingHistory} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Latency:{' '}
          <span className="font-bold text-foreground">
            {node.status === 'online' && node.latency !== null ? `${node.latency} ms` : 'N/A'}
          </span>
        </p>
        <UptimeStatus node={node} />
      </CardFooter>
    </Card>
  );
};

export default NodeCard;
