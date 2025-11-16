'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Node, PingData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const MAX_HISTORY = 30;

const initialNodes: Node[] = [
  { id: '1', displayName: 'Google', name: 'google.com', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '2', displayName: 'GitHub API', name: 'api.github.com', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '3', displayName: 'Cloudflare DNS', name: '1.1.1.1', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '4', displayName: 'Offline Test', name: 'down-node.test', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
];

export function useNodeMonitoring() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [pingInterval, setPingInterval] = useState(3000); // ms
  const { toast } = useToast();

  const simulatePing = useCallback((node: Node) => {
    // Special case for demoing an offline node
    if (node.name === 'down-node.test') {
      return { status: 'offline' as const, latency: null };
    }
    
    const isOffline = Math.random() < 0.1; // 10% chance of being offline
    if (isOffline) {
      return { status: 'offline' as const, latency: null };
    }
    const latency = Math.floor(20 + Math.random() * 280);
    return { status: 'online' as const, latency };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const updatedNodes = nodes.map(node => {
        const { status, latency } = simulatePing(node);
        
        const newPingData: PingData = { time: timeStr, latency };
        const newHistory = [newPingData, ...node.pingHistory].slice(0, MAX_HISTORY);

        let newTotalUptimeSeconds = node.totalUptimeSeconds;
        let newLastStatusChange = node.lastStatusChange;

        // Status changed, handle uptime calculation and notifications
        if (status !== node.status && node.status !== 'pending') {
          if (node.status === 'online') { // If it *was* online, add the duration to total uptime
            newTotalUptimeSeconds += (now - node.lastStatusChange) / 1000;
          }
          newLastStatusChange = now; // Reset the status change timestamp
          
          if (node.status !== 'pending') { // Don't show notifications for initial state
            const notification = {
              title: status === 'offline' ? 'Node Unreachable' : 'Node Connection Restored',
              description: `${node.displayName} (${node.name}) is now ${status}.`,
              variant: status === 'offline' ? 'destructive' as const : undefined,
            };
            // Use a timeout to ensure toast is called after the render cycle
            setTimeout(() => toast(notification), 0);
          }
        } else if (node.status === 'pending') {
          newLastStatusChange = now; // Set initial status change time
        }
        
        let currentUptimeSeconds = newTotalUptimeSeconds;
        if (status === 'online') {
          // Add the current online duration to the total for the percentage calculation
          currentUptimeSeconds += (now - newLastStatusChange) / 1000;
        }

        const appStartTime = new Date(node.id).getTime();
        const totalMonitoredSeconds = (now - appStartTime) / 1000;
        const uptime = totalMonitoredSeconds > 0 ? (currentUptimeSeconds / totalMonitoredSeconds) * 100 : 100;

        return {
          ...node,
          status,
          latency,
          pingHistory: newHistory,
          uptime: Math.min(100, uptime), // Cap at 100
          totalUptimeSeconds: newTotalUptimeSeconds,
          lastStatusChange: newLastStatusChange,
        };
      });

      setNodes(updatedNodes);

    }, pingInterval);

    return () => clearInterval(intervalId);
  }, [pingInterval, simulatePing, toast, nodes]);

  const addNode = useCallback((displayName: string, name: string) => {
    setNodes(prevNodes => {
      if (prevNodes.some(node => node.name === name)) {
        toast({
            title: "Node Exists",
            description: `Node with address "${name}" is already being monitored.`,
            variant: "destructive",
        });
        return prevNodes;
      }
      const newNode: Node = {
        id: new Date().toISOString(), // Use ISO string for a more reliable start time
        displayName,
        name,
        status: 'pending',
        latency: null,
        pingHistory: [],
        uptime: 100,
        totalUptimeSeconds: 0,
        lastStatusChange: Date.now(),
      };
      return [...prevNodes, newNode];
    });
  }, [toast]);

  const removeNode = useCallback((id: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
  }, []);

  const updateNode = useCallback((id: string, displayName: string, name: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === id ? { ...node, displayName, name } : node
      )
    );
  }, []);
  
  const handleSetPingInterval = (value: number) => {
    setPingInterval(value * 1000);
  }

  return { nodes, addNode, removeNode, updateNode, pingInterval: pingInterval / 1000, setPingInterval: handleSetPingInterval };
}
