// Types
export type ComponentKey = 'Carousel' | 'EditableFundTable' | 'FundOverview' | 'LoanCalculation';

// ComponentProps
export interface TopNavigationProps {
  onSelectComponent: (component: ComponentKey) => void;
}

export interface MainContentProps {
  activeComponent: ComponentKey;
}

export interface FundOverviewProps {
  fundData: interFaceFundData[];
  taxRate?: number;
}
export interface EditableFundTableProps {
  fundData: interFaceFundData[];
  setfundData: React.Dispatch<React.SetStateAction<interFaceFundData[]>>;
}
export interface JsonExampleModalProps {
  show: boolean;
  onClose: () => void;
}

export interface FundTracking {
  quantity: number; // remaining units
  totalCost: number; // total invested for remaining units
  realizedGain: number; // accumulated gain from sells
  firstBuyDate?: string;
}

// Data
export interface interFaceFundData {
  date: string; // transaction date
  type: 'holding' | 'buy' | 'sell';
  amount?: number; // total money spent or received
  quantity: number; // number of units bought/sold/held
  unitPrice: number; // price per unit
  note?: string; // optional description
  fundName: 'Nordea Global Enhanced Small Cap Fund BP' | 'Nordea Optima' | 'Nordea Global' | '';
}
