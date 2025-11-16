'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/header';
import NodeList from '@/components/dashboard/node-list';
import SettingsDialog from '@/components/dashboard/settings-dialog';
import { useNodeMonitoring } from '@/hooks/use-node-monitoring';
import type { ViewMode } from '@/lib/types';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const {
    nodes,
    addNode,
    removeNode,
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
        <NodeList nodes={nodes} onRemoveNode={removeNode} viewMode={viewMode} />
      </main>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onAddNode={addNode}
        pingInterval={pingInterval}
        onPingIntervalChange={setPingInterval}
      />
    </div>
  );
}
