import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Signal } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <Signal className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          NodeVigil
        </h1>
      </div>
      <Button variant="outline" size="icon" onClick={onOpenSettings} aria-label="Open settings">
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default Header;
