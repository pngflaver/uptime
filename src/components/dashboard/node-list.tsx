import React, { useState, useEffect } from 'react';
import type { Node, ViewMode } from '@/lib/types';
import NodeCard from './node-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NodeRow from './node-row';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface NodeListProps {
  nodes: Node[];
  onRemoveNode: (id: string) => void;
  onEditNode: (node: Node) => void;
  viewMode: ViewMode;
  onReorder: (startIndex: number, endIndex: number) => void;
}

const NodeList: React.FC<NodeListProps> = ({ nodes, onRemoveNode, onEditNode, viewMode, onReorder }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // The dnd library requires a client-side environment
    // By waiting for this effect, we ensure that the server-rendered markup
    // matches the initial client-side render, preventing hydration errors.
    setIsClient(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    onReorder(result.source.index, result.destination.index);
  };

  const renderStaticList = () => (
    <>
      {viewMode === 'list' ? (
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
                <NodeRow
                  key={node.id}
                  node={node}
                  onRemove={onRemoveNode}
                  onEdit={onEditNode}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {nodes.map(node => (
            <NodeCard key={node.id} node={node} onRemove={onRemoveNode} onEdit={onEditNode} />
          ))}
        </div>
      )}
    </>
  );

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

  // Render a static list on the server and for the initial client render
  if (!isClient) {
    return renderStaticList();
  }

  // Render the interactive DND list only on the client
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {viewMode === 'list' ? (
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
            <Droppable droppableId="node-list-list">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {nodes.map((node, index) => (
                    <Draggable key={node.id} draggableId={node.id} index={index}>
                      {(provided) => (
                        <NodeRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          node={node}
                          onRemove={onRemoveNode}
                          onEdit={onEditNode}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </Card>
      ) : (
        <Droppable droppableId="node-list-grid" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps} 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              {nodes.map((node, index) => (
                <Draggable key={node.id} draggableId={node.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <NodeCard node={node} onRemove={onRemoveNode} onEdit={onEditNode} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default NodeList;
