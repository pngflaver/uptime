'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/header';
import NodeList from '@/components/dashboard/node-list';
import SettingsDialog from '@/components/dashboard/settings-dialog';
import { useNodeMonitoring } from '@/hooks/use-node-monitoring';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    nodes,
    addNode,
    removeNode,
    pingInterval,
    setPingInterval,
  } = useNodeMonitoring();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <NodeList nodes={nodes} onRemoveNode={removeNode} />
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
