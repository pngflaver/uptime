import React from 'react';
import type { Node } from '@/lib/types';
import NodeCard from './node-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info } from 'lucide-react';

interface NodeListProps {
  nodes: Node[];
  onRemoveNode: (id: string) => void;
}

const NodeList: React.FC<NodeListProps> = ({ nodes, onRemoveNode }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {nodes.map(node => (
        <NodeCard key={node.id} node={node} onRemove={onRemoveNode} />
      ))}
    </div>
  );
};

export default NodeList;
