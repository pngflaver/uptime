'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Node } from '@/lib/types';

interface EditNodeDialogProps {
  node: Node | null;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateNode: (id: string, displayName: string, name: string) => void;
}

const formSchema = z.object({
  displayName: z.string().min(1, {
    message: 'Display name is required.',
  }),
  name: z.string().min(3, {
    message: 'Node address must be at least 3 characters.',
  }),
});

const EditNodeDialog: React.FC<EditNodeDialogProps> = ({
  node,
  onOpenChange,
  onUpdateNode,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (node) {
      form.reset({
        displayName: node.displayName,
        name: node.name,
      });
    }
  }, [node, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (node) {
      onUpdateNode(node.id, values.displayName, values.name);
    }
    onOpenChange(false);
  }

  const isOpen = node !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
          <DialogDescription>
            Update the details for your node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Web Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNodeDialog;
