"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2, Info, Edit, CloudUpload, Trash2, Loader2 } from "lucide-react";
import type { User } from "better-auth";
import { toast } from "sonner";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { UploadModal } from "@/components/upload/modal";
import { updateUser } from "@/hooks/auth";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "@/server/auth/config";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(
      MIN_USERNAME_LENGTH,
      `Username must be at least ${MIN_USERNAME_LENGTH} characters long`,
    )
    .max(
      MAX_USERNAME_LENGTH,
      `Username must be at most ${MAX_USERNAME_LENGTH} characters long`,
    ),
});

export function AccountForm({
  handleNext,
  user,
}: {
  handleNext: () => void;
  user: User;
}) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await updateUser({ ...values });
    if (response.error) {
      console.error("Error updating user", response.error);
      form.setError("root", {
        message: response.error.message ?? "Failed to update user",
      });
      return;
    }
    handleNext();
  }

  async function onUploadSuccess(urls: string[]) {
    const response = await updateUser({
      image: urls[0]!,
    });

    if (response.error) {
      console.error("Error updating user", response.error);
      toast.error(response.error.message ?? "Failed to update profile image");
      return;
    }

    toast.success("Profile image updated");
  }

  async function onRemoveImage() {
    const response = await updateUser({
      image: null,
    });

    if (response.error) {
      console.error("Error updating user", response.error);
    }

    toast.success("Profile image removed");
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
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={!user.image}>
                  <User2 />
                  <span>View Profile Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setUploadModalOpen(true)}>
                  <CloudUpload />
                  <span>Upload New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!user.image}
                  variant="destructive"
                  onSelect={onRemoveImage}
                >
                  <Trash2 />
                  <span>Remove Image</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Avatar>
        <UploadModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          onSuccess={onUploadSuccess}
          maxFiles={1}
          maxSize={2 * 1024 * 1024}
          type="profile"
        />
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
                        <EditableLabel>
                          Name{" "}
                          <span className="text-muted-foreground text-xs">
                            (click to edit)
                          </span>
                        </EditableLabel>
                      </FormLabel>
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
              <FormItem className="text-start">
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
            <Button
              type="submit"
              className="w-full max-w-[150px]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
