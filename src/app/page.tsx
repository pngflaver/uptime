'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/header';
import NodeList from '@/components/dashboard/node-list';
import SettingsDialog from '@/components/dashboard/settings-dialog';
import EditNodeDialog from '@/components/dashboard/edit-node-dialog';
import { useNodeMonitoring } from '@/hooks/use-node-monitoring';
import type { Node, ViewMode, ActivityLog } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const {
    nodes,
    addNode,
    removeNode,
    updateNode,
    reorderNodes,
    pingInterval,
    setPingInterval,
    activityLog,
  } = useNodeMonitoring();

  const router = useRouter();

  const handleOpenActivity = () => {
    // Stash the activity log in session storage before navigating
    sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
    sessionStorage.setItem('nodes', JSON.stringify(nodes));
    router.push('/activity');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenActivity={handleOpenActivity}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <NodeList 
          nodes={nodes} 
          onRemoveNode={removeNode} 
          onEditNode={setEditingNode} 
          viewMode={viewMode} 
          onReorder={reorderNodes}
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
