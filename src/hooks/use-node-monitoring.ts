'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Node, PingData, ActivityLog } from '@/lib/types';
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
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
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
      setNodes(prevNodes => {
        const now = Date.now();
        const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newActivity: ActivityLog[] = [];
        const notifications: Parameters<typeof toast>[] = [];

        const updatedNodes = prevNodes.map(node => {
          const { status, latency } = simulatePing(node);
          
          const newPingData: PingData = { time: timeStr, latency };
          const newHistory = [newPingData, ...node.pingHistory].slice(0, MAX_HISTORY);

          let newTotalUptimeSeconds = node.totalUptimeSeconds;
          let newLastStatusChange = node.lastStatusChange;

          if (status !== node.status && node.status !== 'pending') {
            const duration = (now - node.lastStatusChange) / 1000;
            if (node.status === 'online') {
              newTotalUptimeSeconds += duration;
            }

            newActivity.push({
              id: new Date().toISOString() + Math.random(),
              nodeId: node.id,
              nodeDisplayName: node.displayName,
              nodeName: node.name,
              status,
              timestamp: now,
              duration,
            });

            newLastStatusChange = now;
            
            if (node.status !== 'pending') {
              notifications.push([{
                title: status === 'offline' ? 'Node Unreachable' : 'Node Connection Restored',
                description: `${node.displayName} (${node.name}) is now ${status}.`,
                variant: status === 'offline' ? 'destructive' as const : undefined,
              }]);
            }
          } else if (node.status === 'pending') {
            newLastStatusChange = now;
          }
          
          let currentUptimeSeconds = newTotalUptimeSeconds;
          if (status === 'online') {
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
            uptime: Math.min(100, uptime),
            totalUptimeSeconds: newTotalUptimeSeconds,
            lastStatusChange: newLastStatusChange,
          };
        });

        if (newActivity.length > 0) {
          setActivityLog(prevLog => [...newActivity, ...prevLog]);
        }
        
        if (notifications.length > 0) {
          notifications.forEach(n => toast(...n));
        }

        return updatedNodes;
      });
    }, pingInterval);

    return () => clearInterval(intervalId);
  }, [pingInterval, simulatePing, toast]);

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
        id: new Date().toISOString(),
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

  const reorderNodes = useCallback((startIndex: number, endIndex: number) => {
    setNodes(prevNodes => {
      const result = Array.from(prevNodes);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);
  
  const handleSetPingInterval = (value: number) => {
    setPingInterval(value * 1000);
  }

  return { nodes, addNode, removeNode, updateNode, reorderNodes, pingInterval: pingInterval / 1000, setPingInterval: handleSetPingInterval, activityLog };
}
