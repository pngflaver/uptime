'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Node, PingData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const MAX_HISTORY = 30;

const initialNodes: Node[] = [
  { id: '1', name: 'google.com', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '2', name: 'api.github.com', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '3', name: '1.1.1.1', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
  { id: '4', name: 'down-node.test', status: 'pending', latency: null, pingHistory: [], uptime: 100, totalUptimeSeconds: 0, lastStatusChange: Date.now() },
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
      const notifications: Array<{ title: string; description: string; variant?: 'destructive' }> = [];

      const newNodes = nodes.map(node => {
        const { status, latency } = simulatePing(node);
        
        const newPingData: PingData = { time: timeStr, latency };
        const newHistory = [newPingData, ...node.pingHistory].slice(0, MAX_HISTORY);

        let newTotalUptimeSeconds = node.totalUptimeSeconds;
        let newLastStatusChange = node.lastStatusChange;

        if (status !== node.status) {
          if (node.status === 'online') {
            newTotalUptimeSeconds += (now - node.lastStatusChange) / 1000;
          }
          newLastStatusChange = now;
          
          if (node.status !== 'pending') {
            if (status === 'offline') {
              notifications.push({
                  title: 'Node Unreachable',
                  description: `${node.name} is now offline.`,
                  variant: 'destructive',
              });
            } else if (status === 'online') {
              notifications.push({
                  title: 'Node Connection Restored',
                  description: `${node.name} is back online.`,
              });
            }
          }
        }
        
        let currentUptimeSeconds = newTotalUptimeSeconds;
        if (status === 'online') {
          currentUptimeSeconds += (now - newLastStatusChange) / 1000;
        }

        const totalMonitoredSeconds = (now - Date.parse(node.id)) / 1000;
        const uptime = totalMonitoredSeconds > 0 ? (currentUptimeSeconds / totalMonitoredSeconds) * 100 : 100;

        return {
          ...node,
          status,
          latency,
          pingHistory: newHistory,
          uptime,
          totalUptimeSeconds: newTotalUptimeSeconds,
          lastStatusChange: newLastStatusChange,
        };
      });

      setNodes(newNodes);

      notifications.forEach(notification => {
        toast(notification);
      });

    }, pingInterval);

    return () => clearInterval(intervalId);
  }, [pingInterval, simulatePing, toast, nodes]);

  const addNode = useCallback((name: string) => {
    setNodes(prevNodes => {
      if (prevNodes.some(node => node.name === name)) {
        toast({
            title: "Node Exists",
            description: `Node with name "${name}" is already being monitored.`,
            variant: "destructive",
        });
        return prevNodes;
      }
      const newNode: Node = {
        id: new Date().toISOString(), // Use ISO string for a more reliable start time
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
  
  const handleSetPingInterval = (value: number) => {
    setPingInterval(value * 1000);
  }

  return { nodes, addNode, removeNode, pingInterval: pingInterval / 1000, setPingInterval: handleSetPingInterval };
}
