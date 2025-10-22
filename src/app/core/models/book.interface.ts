export interface Book {
  id?: string;
  title: string;
  categories?: Array<string>;
  description?: string;
  author: string;
  publishedDate?: string;
  coverUrl?: string;
  userId?: string;
}
