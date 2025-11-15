'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddNode: (name: string) => void;
  pingInterval: number;
  onPingIntervalChange: (value: number) => void;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Node name must be at least 3 characters.',
  }),
});

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddNode,
  pingInterval,
  onPingIntervalChange,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddNode(values.name);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your node monitoring settings here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-medium">Add New Node</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Node IP or Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 192.168.1.1 or my-server.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Node</Button>
            </DialogFooter>
          </form>
        </Form>
        
        <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Configuration</h3>
            <div className="space-y-3">
                <Label htmlFor="ping-interval">Ping Interval: {pingInterval} seconds</Label>
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-muted-foreground'>1s</span>
                    <Slider
                        id="ping-interval"
                        min={1}
                        max={10}
                        step={1}
                        value={[pingInterval]}
                        onValueChange={(value) => onPingIntervalChange(value[0])}
                    />
                    <span className='text-sm text-muted-foreground'>10s</span>
                </div>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
