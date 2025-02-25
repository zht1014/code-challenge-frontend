import { useMemo } from "react";
import { useState } from "react";

  interface WalletBalance {
    currency: string;
    amount: number;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  
  class Datasource {
    private url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    async getPrices(): Promise<Record<string, number>> {
      try {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Failed to fetch prices");
        return await response.json();
      } catch (error) {
        console.error("Error fetching prices:", error);
        return {};
      }
    }
  }
  
  interface Props extends BoxProps {
  
  }
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");  //Datasource should be defined outside the component 
                                                                                      // and provided as a service to avoid duplicate instantiation.
    useEffect(() => {
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        console.err(error);
      });
    }, []);
  
      const getPriority = (blockchain: any): number => {
        switch (blockchain) {
          case 'Osmosis':
            return 100
          case 'Ethereum':
            return 50
          case 'Arbitrum':
            return 30
          case 'Zilliqa':
            return 20
          case 'Neo':
            return 20
          default:
            return -99
        }
      }
  
      const sortedBalancesWithFormatted = useMemo(() => {
        return balances
          .filter(balance => getPriority(balance.blockchain) > -99) 
          .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain)) 
          .map(balance => ({
            ...balance,
            formatted: balance.amount.toFixed()
          }));
      }, [balances]);
      
      const rows = sortedBalancesWithFormatted.map(balance => {
        const usdValue = (prices[balance.currency] || 0) * balance.amount;
        return (
          <WalletRow 
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}  //Improve the utilization of useMemo by only recalculating  when balances change. 
                                                 //This is because prices do not affect sortedBalances calculations. Merge filter + sort + map to 
                                                 //reduce one redundant map() computation
          />
        );
      });
      
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }