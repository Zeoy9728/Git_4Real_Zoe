import axios from "axios";
import { FilesWithId } from "./types/file";

export const UploadFile = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob);

  const res = await axios.post(
    "https://ipfs-relay.crossbell.io/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return {
    key: res.data.url,
  };
};

export async function uploadFiles(files: FilesWithId): Promise<
  | {
      address?: string;
      alt: string;
      name: string;
      mime_type: string;
      size_in_bytes: number;
    }[]
  | null
> {
  if (!files.length) return null;
  const attachments = await Promise.all(
    files.map(async (file) => {
      const { name } = file;
      const { key: address } = await UploadFile(file);
      return {
        address,
        alt: name,
        name,
        mime_type: file.type,
        size_in_bytes: file.size,
      };
    })
  );
  return attachments;
}
