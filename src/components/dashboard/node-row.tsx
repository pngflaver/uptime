import React from 'react';
import type { Node } from '@/lib/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PingChart from './ping-chart';

interface NodeRowProps {
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
    pending: 'Pending',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-2.5 w-2.5 rounded-full', statusClasses[status])} />
      <span className="capitalize">{statusText[status]}</span>
    </div>
  );
};

const NodeRow: React.FC<NodeRowProps> = ({ node, onRemove }) => {
  return (
    <TableRow>
      <TableCell>
        <StatusIndicator status={node.status} />
      </TableCell>
      <TableCell className="font-medium break-all">{node.name}</TableCell>
      <TableCell>
        {node.status === 'online' && node.latency !== null ? `${node.latency} ms` : 'N/A'}
      </TableCell>
       <TableCell>{node.uptime.toFixed(2)}%</TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="h-[40px] w-[150px]">
          <PingChart data={node.pingHistory} />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </TableCell>
    </TableRow>
  );
};

export default NodeRow;
