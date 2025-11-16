import React from 'react';
import type { Node, ViewMode } from '@/lib/types';
import NodeCard from './node-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NodeRow from './node-row';

interface NodeListProps {
  nodes: Node[];
  onRemoveNode: (id: string) => void;
  viewMode: ViewMode;
}

const NodeList: React.FC<NodeListProps> = ({ nodes, onRemoveNode, viewMode }) => {
  if (nodes.length === 0) {
    return (
      <Card className="mt-8 col-span-full">
        <CardHeader className="flex-row items-center gap-4">
            <Info className="w-8 h-8 text-muted-foreground" />
            <CardTitle className="m-0">No Nodes to Display</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            Please add a node using the settings panel to begin monitoring.
            </p>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Node</TableHead>
                        <TableHead>Latency</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead className="w-[150px] hidden sm:table-cell">Ping History</TableHead>
                        <TableHead className="w-[50px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {nodes.map(node => (
                        <NodeRow key={node.id} node={node} onRemove={onRemoveNode} />
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {nodes.map(node => (
        <NodeCard key={node.id} node={node} onRemove={onRemoveNode} />
      ))}
    </div>
  );
};

export default NodeList;
