import { useCurrency, formatCurrency, convertPrice } from '@/hooks/use-currency';

interface PriceDisplayProps {
  usdAmount: number;
  className?: string;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function PriceDisplay({ 
  usdAmount, 
  className = "", 
  showOriginal = false,
  size = 'md'
}: PriceDisplayProps) {
  const { currentCurrency, isLoading } = useCurrency();

  if (isLoading) {
    return <span className={`text-gray-400 ${className}`}>Loading price...</span>;
  }

  const convertedAmount = convertPrice(usdAmount, currentCurrency);
  const isUSD = currentCurrency.code === 'USD';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-3xl'
  };

  return (
    <div className={`${className}`}>
      <span className={`font-bold ${sizeClasses[size]}`}>
        {formatCurrency(convertedAmount, currentCurrency)}
      </span>
      {!isUSD && showOriginal && (
        <span className="text-gray-500 text-sm ml-2">
          (${usdAmount} USD)
        </span>
      )}
    </div>
  );
}