import { getRandomId } from "./random";
import type { FilesWithId, FileWithId, PreviewData } from "./types/file";

const IMAGE_EXTENSIONS = [
  "apng",
  "avif",
  "gif",
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "svg",
  "webp",
] as const;

type ImageExtensions = (typeof IMAGE_EXTENSIONS)[number];

function isValidImageExtension(
  extension: string
): extension is ImageExtensions {
  return IMAGE_EXTENSIONS.includes(
    extension.split(".").pop()?.toLowerCase() as ImageExtensions
  );
}

export function isValidImage(name: string, bytes: number): boolean {
  return isValidImageExtension(name) && bytes < 20 * Math.pow(1024, 2);
}

type ImagesData = {
  imagesPreviewData: PreviewData;
  selectedImagesData: FilesWithId;
};

export function getImagesData(
  files: FileList | null,
  currentFiles?: number
): ImagesData | null {
  if (!files || !files.length) return null;

  const singleEditingMode = currentFiles === undefined;

  const rawImages =
    singleEditingMode ||
    !(currentFiles === 4 || files.length > 4 - currentFiles)
      ? Array.from(files).filter(({ name, size }) => isValidImage(name, size))
      : null;

  if (!rawImages || !rawImages.length) return null;

  const imagesId = rawImages.map(({ name }) => {
    const randomId = getRandomId();
    return {
      id: randomId,
      name: name === "image.png" ? `${randomId}.png` : null,
    };
  });

  const imagesPreviewData = rawImages.map((image, index) => ({
    id: imagesId[index].id,
    src: URL.createObjectURL(image),
    alt: imagesId[index].name ?? image.name,
  }));

  const selectedImagesData = rawImages.map((image, index) =>
    renameFile(image, imagesId[index].id, imagesId[index].name)
  );

  return { imagesPreviewData, selectedImagesData };
}

export function getAudioData(files: FileList | null): {
  audioPreviewData: PreviewData;
  selectedAudioData: FilesWithId;
} | null {
  if (!files || !files.length) return null;

  const rawAudio = Array.from(files);

  const audioId = rawAudio.map(({ name }) => {
    const randomId = getRandomId();
    return {
      id: randomId,
      name: null,
    };
  });

  const audioPreviewData = rawAudio.map((audio, index) => ({
    id: audioId[index].id,
    src: URL.createObjectURL(audio),
    alt: audioId[index].name ?? audio.name,
  }));

  const selectedAudioData = rawAudio.map((audio, index) =>
    renameFile(audio, audioId[index].id, audioId[index].name)
  );

  return { audioPreviewData, selectedAudioData };
}

export function getVideoData(files: FileList | null): {
  videoPreviewData: PreviewData;
  selectedVideoData: FilesWithId;
} | null {
  if (!files || !files.length) return null;

  const rawVideo = Array.from(files);

  const videoId = rawVideo.map(({ name }) => {
    const randomId = getRandomId();
    return {
      id: randomId,
      name: null,
    };
  });

  const videoPreviewData = rawVideo.map((video, index) => ({
    id: videoId[index].id,
    src: URL.createObjectURL(video),
    alt: videoId[index].name ?? video.name,
  }));

  const selectedVideoData = rawVideo.map((video, index) =>
    renameFile(video, videoId[index].id, videoId[index].name)
  );

  return { videoPreviewData, selectedVideoData };
}

function renameFile(
  file: File,
  newId: string,
  newName: string | null
): FileWithId {
  return Object.assign(
    newName
      ? new File([file], newName, {
          type: file.type,
          lastModified: file.lastModified,
        })
      : file,
    { id: newId }
  );
}
