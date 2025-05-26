import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Currency conversion hook using Fixer.io
const FIXER_API_KEY = '7dba2479b88fc3436993f4bf318d889b';
const BASE_PRICE_USD = 29; // Pro subscription price in USD

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  convertedPrice: number;
}

interface CurrencyContextType {
  currentCurrency: CurrencyData;
  availableCurrencies: CurrencyData[];
  setCurrency: (currencyCode: string) => void;
  isLoading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Supported currencies with their symbols and names
const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  KRW: { symbol: '₩', name: 'Korean Won' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' }
};

// Detect user's currency based on location
const detectUserCurrency = (): string => {
  const locale = navigator.language || 'en-US';
  const currencyMap: { [key: string]: string } = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'es': 'EUR',
    'es-ES': 'EUR',
    'fr': 'EUR',
    'fr-FR': 'EUR',
    'pt': 'BRL',
    'pt-BR': 'BRL',
    'ko': 'KRW',
    'ko-KR': 'KRW',
    'zh': 'CNY',
    'zh-CN': 'CNY',
    'ja': 'JPY',
    'ja-JP': 'JPY'
  };
  
  return currencyMap[locale] || currencyMap[locale.split('-')[0]] || 'USD';
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [currentCurrencyCode, setCurrentCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('selectedCurrency') || detectUserCurrency();
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exchange rates from Fixer.io
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoading(true);
        const currencies = Object.keys(SUPPORTED_CURRENCIES).join(',');
        const response = await fetch(
          `https://api.fixer.io/v1/latest?access_key=${FIXER_API_KEY}&symbols=${currencies}&base=USD`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setExchangeRates({ USD: 1, ...data.rates });
        } else {
          throw new Error(data.error?.info || 'Failed to fetch exchange rates');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
        // Fallback rates if API fails
        setExchangeRates({
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 148,
          KRW: 1320,
          BRL: 5.1,
          CAD: 1.36,
          AUD: 1.52,
          CNY: 7.3
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Create currency data objects
  const availableCurrencies: CurrencyData[] = Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => {
    const rate = exchangeRates[code] || 1;
    const convertedPrice = code === 'JPY' || code === 'KRW' 
      ? Math.round(BASE_PRICE_USD * rate)
      : Math.round(BASE_PRICE_USD * rate * 100) / 100;
    
    return {
      code,
      symbol: info.symbol,
      name: info.name,
      rate,
      convertedPrice
    };
  });

  const currentCurrency = availableCurrencies.find(c => c.code === currentCurrencyCode) || availableCurrencies[0];

  const setCurrency = (currencyCode: string) => {
    setCurrentCurrencyCode(currencyCode);
    localStorage.setItem('selectedCurrency', currencyCode);
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      availableCurrencies,
      setCurrency,
      isLoading,
      error
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: CurrencyData): string {
  if (currency.code === 'JPY' || currency.code === 'KRW') {
    return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${currency.symbol}${amount.toFixed(2)}`;
}

// Helper function to convert USD to any currency
export function convertPrice(usdAmount: number, targetCurrency: CurrencyData): number {
  const converted = usdAmount * targetCurrency.rate;
  return targetCurrency.code === 'JPY' || targetCurrency.code === 'KRW' 
    ? Math.round(converted)
    : Math.round(converted * 100) / 100;
}