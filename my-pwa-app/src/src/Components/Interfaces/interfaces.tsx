export interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

export interface FundData {
  date: string; // transaction date
  type: 'holding' | 'buy' | 'sell';
  amount: number; // total money spent or received
  quantity: number; // number of units bought/sold/held
  unitPrice: number; // price per unit
  note?: string; // optional description
  fundName: string;
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
