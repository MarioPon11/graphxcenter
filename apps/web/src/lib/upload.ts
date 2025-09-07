import "server-only";

import { BlobServiceClient } from "@azure/storage-blob";
import { logger } from "@/lib/logger";
import { env } from "@/env/server";
import { generateId } from "@/lib/id";
import type { users } from "@/server/db/schema";

export const client = BlobServiceClient.fromConnectionString(
  env.AZ_CONNECTION_STRING,
);

export const containerClient = client.getContainerClient(
  env.AZ_IMAGES_CONTAINER,
);

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export function getPublicUrl(blobUrl: string): string {
  const filePath = blobUrl.split("blob.core.windows.net/").pop();
  const customUrl = `${env.AZ_CUSTOM_DOMAIN}/${filePath}`;
  return customUrl;
}

export const allowedExtension = ["png", "jpg", "jpeg", "webp"];
export type FileType = "avatar" | "logo" | "application";
export const allowedFileTypes: FileType[] = ["avatar", "logo", "application"];

type UploadFileSuccess = {
  success: true;
  url: string;
  error?: undefined;
};

type UploadFileError = {
  success: false;
  error: string;
  url?: undefined;
};

type UploadFileResult = UploadFileSuccess | UploadFileError;

export async function uploadFile(
  file: File,
  type: FileType,
  user: typeof users.$inferSelect,
): Promise<UploadFileResult> {
  logger.debug(
    "Initiating file upload",
    {
      logType: "upload",
      fileName: file.name,
      extension: file.type,
      fileSize: file.size,
    },
    {
      logType: "user",
      ...user,
    },
  );
  if (file.size > MAX_FILE_SIZE) {
    logger.error(
      "File size exceeds the maximum allowed size",
      {
        logType: "upload",
        fileName: file.name,
        extension: file.type,
        fileSize: file.size,
      },
      {
        logType: "user",
        ...user,
      },
    );
    return {
      success: false,
      error: "File size exceeds the maximum allowed size",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtension.includes(extension)) {
    logger.error(
      "File extension does not match file type",
      {
        logType: "upload",
        fileName: file.name,
        extension: file.type,
        fileSize: file.size,
      },
      {
        logType: "user",
        ...user,
      },
    );
    return {
      success: false,
      error: "File extension does not match file type",
    };
  }

  const fileName = `${type}/${generateId()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    const url = blockBlobClient.url;
    logger.debug(
      "File upload blob upload success",
      {
        logType: "upload",
        fileName,
        extension,
        fileSize: file.size,
        userId: user.id,
        url,
        publicUrl: getPublicUrl(url),
      },
      {
        logType: "user",
        ...user,
      },
    );

    return {
      success: true,
      url: getPublicUrl(url),
    };
  } catch (error) {
    logger.error(
      "Unknown error occured",
      {
        logType: "upload",
        fileName: file.name,
        extension: file.type,
        fileSize: file.size,
        error,
      },
      {
        logType: "user",
        ...user,
      },
    );
    return {
      success: false,
      error: "Unknown error occurred",
    };
  }
}
