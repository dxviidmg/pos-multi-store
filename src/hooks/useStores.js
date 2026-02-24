import { useQuery } from '@tanstack/react-query';
import { getStores } from '../components/apis/stores';

export const useStores = (params) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => getStores(params),
    select: (response) => {
      const stores = response.data;
      
      const totals = stores.reduce(
        (acc, store) => ({
          profit: acc.profit + store.cash_summary[8].amount,
          paymentCash: acc.paymentCash + store.cash_summary[0].amount,
          paymentCard: acc.paymentCard + store.cash_summary[1].amount,
          paymentTransfer: acc.paymentTransfer + store.cash_summary[2].amount,
          totalPayment: acc.totalPayment + store.cash_summary[3].amount,
          totalSales: acc.totalSales + store.cash_summary[10].amount,
          cash: acc.cash + store.cash_summary[7].amount,
          investment: 0,
          canceledSales: acc.canceledSales + store.cash_summary[11].amount,
        }),
        {
          profit: 0,
          paymentCash: 0,
          paymentCard: 0,
          paymentTransfer: 0,
          totalPayment: 0,
          totalSales: 0,
          cash: 0,
          investment: 0,
          canceledSales: 0,
        }
      );

      return { stores, totals };
    },
  });
};
