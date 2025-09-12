"use server";

import { BlobServiceClient } from "@azure/storage-blob";
import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { env } from "@/env/server";
import { generateId } from "@/lib/id";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

const client = BlobServiceClient.fromConnectionString(env.AZ_CONNECTION_STRING);

const containerClient = client.getContainerClient(env.AZ_IMAGES_CONTAINER);

function getPublicUrl(blobUrl: string): string {
  const filePath = blobUrl.split("blob.core.windows.net/").pop();
  const customUrl = `${env.AZ_CUSTOM_DOMAIN}/${filePath}`;
  return customUrl;
}

const allowedExtension = ["png", "jpg", "jpeg", "webp"];
type FileType = "profile" | "cover" | "room";

type UploadFileSuccess = {
  url: string;
  error?: undefined;
};

type UploadFileError = {
  error: {
    message: string;
    code: string;
  };
  url?: undefined;
};

type UploadFileResult = UploadFileSuccess | UploadFileError;

export async function uploadFile({
  file,
  type = "profile",
  path,
}: {
  file: File;
  type?: FileType;
  path?: string;
}): Promise<UploadFileResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    };
  }

  logger.debug("Starting file upload", {
    logType: "upload",
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    type,
  });
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtension.includes(extension)) {
    return {
      error: {
        message: "Invalid file type",
        code: "INVALID_FILE_TYPE",
      },
    };
  }

  const blobName = `${type}/${generateId()}.${extension}`;
  const blobBuffer = Buffer.from(await file.arrayBuffer());
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    await blockBlobClient.upload(blobBuffer, blobBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });
    const url = getPublicUrl(blockBlobClient.url);
    logger.info(
      "File uploaded successfully",
      {
        logType: "upload",
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        type,
        blobName,
        url,
      },
      {
        logType: "user",
        ...session.user,
      },
    );
    if (path) {
      revalidatePath(path);
    }
    return { url };
  } catch (error) {
    logger.error(
      "Failed to upload file",
      {
        logType: "upload",
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        type,
        blobName,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        logType: "user",
        ...session.user,
      },
    );
    return {
      error: {
        message: "An unexpected error occurred",
        code: "UNEXPECTED_ERROR",
      },
    };
  }
}
