export interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}
// DataPictures.tsx
export interface CarouselItemData {
  id: number; // numeric id for your data
  src: string; // image URL
  alt?: string; // alt text
  title?: string; // caption headline
  description?: string; // caption paragraph
  link?: string; // optional "learn more" link
}
