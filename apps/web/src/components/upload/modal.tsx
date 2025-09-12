"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, X } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@repo/ui/components/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { LoadingSwap } from "@repo/ui/components/loading-swap";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { uploadFile } from "./action";

type UploadModalProps = React.ComponentProps<typeof Dialog> & {
  type?: "profile" | "cover" | "room";
  maxFiles?: number;
  maxSize?: number;
  children?: React.ReactNode;
  onSuccess?: (urls: string[]) => void | Promise<void>;
};

export function UploadModal({
  type = "profile",
  maxFiles = 1,
  maxSize = 2 * 1024 * 1024,
  onSuccess,
  children,
  ...props
}: UploadModalProps) {
  const pathname = usePathname();
  const formSchema = z.object({
    files: z
      .array(z.custom<File>())
      .min(1, "Please select at least one file")
      .max(maxFiles, `Please select up to ${maxFiles} files`)
      .refine((files) => files.every((file) => file.size <= maxSize), {
        message: `File size must be less than ${maxSize}`,
        path: ["files"],
      }),
    type: z.enum(["profile", "cover", "room"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      type,
    },
  });

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof formSchema>) => {
      const urls = await Promise.all(
        data.files.map(async (file) => {
          const result = await uploadFile({
            file,
            type: data.type,
            path: pathname,
          });
          if (result.error) {
            toast.error(result.error.message);
            throw new Error(result.error.message);
          }
          return result.url;
        }),
      );

      if (onSuccess) {
        await onSuccess(urls);
      }
    },
    [onSuccess, pathname],
  );

  return (
    <Dialog {...props}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Modal</DialogTitle>
          <DialogDescription>Upload a {type} image</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="upload-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
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
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onValueChange={field.onChange}
                      accept="image/*"
                      maxFiles={maxFiles}
                      maxSize={maxSize}
                      onFileReject={(_, message) => {
                        form.setError("files", {
                          message,
                        });
                      }}
                      multiple
                    >
                      {field.value.length < maxFiles && (
                        <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                          <CloudUpload className="size-4" />
                          Drag and drop or
                          <FileUploadTrigger asChild>
                            <Button variant="link" size="sm" className="p-0">
                              choose files
                            </Button>
                          </FileUploadTrigger>
                          to upload
                        </FileUploadDropzone>
                      )}
                      <FileUploadList>
                        {field.value.map((file, index) => (
                          <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <X />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  {!form.formState.errors.files && (
                    <FormDescription>
                      Upload up to {maxFiles} images up to{" "}
                      {maxSize / 1024 / 1024}MB each.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="upload-form"
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            <LoadingSwap
              isLoading={form.formState.isSubmitting}
              className="inline-flex items-center gap-2"
            >
              Upload
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
