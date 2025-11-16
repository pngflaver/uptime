'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/header';
import NodeList from '@/components/dashboard/node-list';
import SettingsDialog from '@/components/dashboard/settings-dialog';
import EditNodeDialog from '@/components/dashboard/edit-node-dialog';
import { useNodeMonitoring } from '@/hooks/use-node-monitoring';
import type { Node, ViewMode } from '@/lib/types';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const {
    nodes,
    addNode,
    removeNode,
    updateNode,
    pingInterval,
    setPingInterval,
  } = useNodeMonitoring();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <NodeList 
          nodes={nodes} 
          onRemoveNode={removeNode} 
          onEditNode={setEditingNode} 
          viewMode={viewMode} 
        />
      </main>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onAddNode={addNode}
        pingInterval={pingInterval}
        onPingIntervalChange={setPingInterval}
      />
      <EditNodeDialog
        node={editingNode}
        onOpenChange={() => setEditingNode(null)}
        onUpdateNode={updateNode}
      />
    </div>
  );
}
