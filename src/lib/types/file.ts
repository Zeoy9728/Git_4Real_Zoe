export type ImageData = {
  src: string;
  alt: string;
};

export type PreviewData = {
  src: string;
  alt: string;
  id: string;
}[];

export type ImagePreview = ImageData & { id: string };
export type FileWithId = File & { id: string };

export type FilesWithId = (File & {
  id: string;
})[];
