import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ViewMode } from '@/lib/types';

interface HeaderProps {
  onOpenSettings: () => void;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
}

const StopAndShopLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="120"
    height="32"
    viewBox="0 0 120 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x="0"
      y="24"
      fontFamily="Arial, sans-serif"
      fontSize="22"
      fontWeight="bold"
      fill="#A6192E"
    >
      Stop
    </text>
    <g transform="translate(50, 4)">
      <path
        d="M9.8,9.2C7.3,9.2,5.2,8.2,3.7,6.4c2.1-1.3,3.5-3.6,3.5-6.4h4.7c0,3.3,1.8,6.2,4.5,7.9C14.3,8.7,12.1,9.2,9.8,9.2z"
        fill="#A6192E"
      ></path>
      <path
        d="M15.9,15.6c-2.8-1.6-4.5-4.5-4.5-7.9h4.7c0,2.8,1.4,5.1,3.5,6.4C17.4,14.9,16.5,15.3,15.9,15.6z"
        fill="#F5B124"
      ></path>
      <path
        d="M8.2,0C5.5,0,3.2,1.3,1.6,3.4c1.4,1.8,3.5,2.9,5.9,2.9c2.4,0,4.5-1.1,5.9-2.9C11.7,1.3,9.5,0,8.2,0z"
        fill="#6A2E83"
      ></path>
    </g>
    <text
      x="78"
      y="24"
      fontFamily="Arial, sans-serif"
      fontSize="22"
      fontWeight="bold"
      fill="#A6192E"
    >
      Shop
    </text>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ onOpenSettings, viewMode, onViewModeChange }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <StopAndShopLogo className="h-8 w-auto" />
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
        <Button variant="outline" size="icon" onClick={onOpenSettings} aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
