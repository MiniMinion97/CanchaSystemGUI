import { ImageProviderType } from "./image-provider-type";

export interface Image {
    id: string,
    imageProviderType: ImageProviderType,
    fileName: string,
    storedPath: string,
    mimeType: string,
    size: number,
    uploadData: string
}
