import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getAccountWithTransactions } from "@/actions/account";
import { formatCurrency } from "@/lib/constant";
import { AccountChartLoader } from "../_components/account-chart-loader";
import { TransactionTableLoader } from "../_components/transaction-table-loader";

interface AccountPageProps {
  params: {
    id: string;
  };
}

const AccountChart = dynamic(
  () => import("../_components/account-chart").then((mod) => mod.AccountChart),
  {
    loading: () => <AccountChartLoader />,
  },
);

const TransactionTable = dynamic(
  () =>
    import("../_components/transaction-table").then(
      (mod) => mod.TransactionTable,
    ),
  {
    loading: () => <TransactionTableLoader />,
  },
);

export default async function AccountPage({ params }: AccountPageProps) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  // return <AccountChartLoader />;

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="gradient-title text-5xl font-bold capitalize tracking-tight sm:text-6xl">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="pb-2 text-right">
          <div className="text-xl font-bold sm:text-2xl">
            {formatCurrency(account.balance)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <AccountChart transactions={transactions} />

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} />
    </>
  );
}
