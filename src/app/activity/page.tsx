'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FilterX } from 'lucide-react';
import { format, formatDistanceStrict } from 'date-fns';
import type { ActivityLog, Node } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const StatusIndicator: React.FC<{ status: ActivityLog['status'] }> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-2.5 w-2.5 rounded-full', status === 'online' ? 'bg-green-500' : 'bg-red-500')} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

function formatDuration(seconds: number) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return formatDistanceStrict(0, seconds * 1000, {
        unit: seconds > 3600 * 24 ? 'day' : undefined,
    });
}

const ActivityPage: React.FC = () => {
    const [log, setLog] = useState<ActivityLog[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [filteredNodeId, setFilteredNodeId] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState<{key: keyof ActivityLog, dir: 'asc' | 'desc'}>({ key: 'timestamp', dir: 'desc' });

    useEffect(() => {
        try {
            const storedLog = sessionStorage.getItem('activityLog');
            const storedNodes = sessionStorage.getItem('nodes');
            if (storedLog) {
                setLog(JSON.parse(storedLog));
            }
            if (storedNodes) {
                setNodes(JSON.parse(storedNodes));
            }
        } catch (error) {
            console.error("Failed to parse activity log from session storage", error);
        }
    }, []);

    const handleDownloadCSV = () => {
        const headers = ['Node Display Name', 'Node Address', 'Status', 'Timestamp', 'Previous State Duration (s)'];
        const rows = filteredLog.map(entry => [
            entry.nodeDisplayName,
            entry.nodeName,
            entry.status,
            format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            entry.duration.toFixed(2),
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `activity_log_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (key: keyof ActivityLog) => {
        setSort(prevSort => ({
            key,
            dir: prevSort.key === key && prevSort.dir === 'desc' ? 'asc' : 'desc'
        }));
    };

    const sortedLog = React.useMemo(() => {
        return [...log].sort((a, b) => {
            const aVal = a[sort.key];
            const bVal = b[sort.key];
            if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [log, sort]);
    
    const filteredLog = React.useMemo(() => {
        return sortedLog.filter(entry => {
            const nodeMatch = filteredNodeId === 'all' || entry.nodeId === filteredNodeId;
            const searchMatch = searchTerm === '' || 
                                entry.nodeDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                entry.nodeName.toLowerCase().includes(searchTerm.toLowerCase());
            return nodeMatch && searchMatch;
        });
    }, [sortedLog, filteredNodeId, searchTerm]);

    return (
        <div className="flex flex-col min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <header className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Node Activity Log</h1>
            </header>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>History</CardTitle>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input 
                                placeholder="Search logs..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-[250px]"
                            />
                            <Select value={filteredNodeId} onValueChange={setFilteredNodeId}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by node" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Nodes</SelectItem>
                                    {nodes.map(node => (
                                        <SelectItem key={node.id} value={node.id}>{node.displayName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             {filteredNodeId !== 'all' || searchTerm !== '' ? (
                                <Button variant="ghost" size="icon" onClick={() => { setFilteredNodeId('all'); setSearchTerm(''); }}>
                                    <FilterX className="h-4 w-4" />
                                </Button>
                            ) : null }
                            <Button onClick={handleDownloadCSV}>
                                <Download className="mr-2 h-4 w-4" />
                                CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => handleSort('nodeDisplayName')} className="cursor-pointer">Node</TableHead>
                                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">New Status</TableHead>
                                <TableHead onClick={() => handleSort('timestamp')} className="cursor-pointer">Timestamp</TableHead>
                                <TableHead onClick={() => handleSort('duration')} className="cursor-pointer text-right">Prev. State Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLog.length > 0 ? (
                                filteredLog.map(entry => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-medium">
                                          <div className="flex flex-col">
                                            <span className="font-bold">{entry.nodeDisplayName}</span>
                                            <span className="text-xs text-muted-foreground">{entry.nodeName}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusIndicator status={entry.status} />
                                        </TableCell>
                                        <TableCell>{format(new Date(entry.timestamp), 'Pp')}</TableCell>
                                        <TableCell className="text-right">{formatDuration(entry.duration)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No activity log entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivityPage;
