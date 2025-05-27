import { useCurrency } from '@/hooks/use-currency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function CurrencySelector() {
  const { currentCurrency, availableCurrencies, setCurrency, isLoading } = useCurrency();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Globe className="w-4 h-4" />
        <span>Loading currencies...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <Select value={currentCurrency.code} onValueChange={setCurrency}>
        <SelectTrigger className="w-auto min-w-[120px] h-8 text-sm">
          <SelectValue>
            {currentCurrency.symbol} {currentCurrency.code}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-mono">{currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-gray-500">- {currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}