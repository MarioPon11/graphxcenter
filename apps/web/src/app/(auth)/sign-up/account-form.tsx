"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2, Info, Edit, CloudUpload, Trash2 } from "lucide-react";
import type { User } from "better-auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
} from "@repo/ui/components/editable";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@repo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

const formSchema = z.object({
  image: z.string().nullable(),
  name: z.string().min(1),
  username: z.string().min(1),
});

export function AccountForm({
  handleNext,
  user,
}: {
  handleNext: () => void;
  user: User;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      image: user.image,
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    handleNext();
  }

  return (
    <div className="flex gap-6">
      <div>
        <Avatar className="group/avatar relative size-28">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
          <div className="absolute top-1/2 left-1/2 z-10 size-full -translate-x-1/2 -translate-y-1/2 bg-black/10 opacity-0 group-hover/avatar:opacity-100" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/avatar:opacity-100"
              >
                <Edit />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CloudUpload />
                  <span>Upload Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!form.getValues("image")}>
                  <Trash2 />
                  <span>Remove Image</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Avatar>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex-1 space-y-2")}
        >
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editable
                    defaultValue={field.value}
                    onSubmit={field.onChange}
                    invalid={!!form.formState.errors.name}
                  >
                    <div className="flex items-start gap-2">
                      <FormLabel asChild>
                        <EditableLabel>Name</EditableLabel>
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Your name will be hidden from other users. This is
                              internal only.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-start gap-4">
                      <EditableArea className="flex-1 text-start font-bold">
                        <EditablePreview className="!text-2xl" />
                        <EditableInput />
                      </EditableArea>
                    </div>
                    <EditableToolbar>
                      <EditableSubmit asChild>
                        <Button type="button" size="sm">
                          Save
                        </Button>
                      </EditableSubmit>
                      <EditableCancel asChild>
                        <Button type="button" variant="outline" size="sm">
                          Cancel
                        </Button>
                      </EditableCancel>
                    </EditableToolbar>
                    <FormMessage />
                  </Editable>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormLabel>Username</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This will be the name displayed for other users.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Enter your username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-8 flex justify-end">
            <Button type="submit" className="w-full max-w-[150px]">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const fileSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "At least one file is required")
    .max(1, "Only one file is allowed"),
});

function ImageUpload({
  user,
  onOpenChange,
  open,
}: {
  user: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: [],
    },
  });

  function onSubmit(values: z.infer<typeof fileSchema>) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Upload an image to your account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <p>Upload content</p>
            <DialogFooter>
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="button">Upload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
