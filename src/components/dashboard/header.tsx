import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings, LayoutGrid, List, History } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ViewMode } from '@/lib/types';

interface HeaderProps {
  onOpenSettings: () => void;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  onOpenActivity: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, viewMode, onViewModeChange, onOpenActivity }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <Image src="https://logodix.com/logo/1300958.png" alt="Stop & Shop Logo" width={120} height={32} className="h-8 w-auto" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          SNS Sites Uptime
        </h1>
      </div>
      <div className='flex items-center gap-2'>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => value && onViewModeChange(value)} aria-label="View mode">
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button variant="outline" size="icon" onClick={onOpenActivity} aria-label="Open activity log">
          <History className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="icon" onClick={onOpenSettings} aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
