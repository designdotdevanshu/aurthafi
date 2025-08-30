export const dynamic = "force-dynamic";

import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction, Transaction } from "@/actions/transaction";
import { AddTransactionForm } from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";

type AddTransactionPageProps = {
  searchParams?: {
    edit?: string;
  };
};

export default async function AddTransactionPage({
  searchParams,
}: AddTransactionPageProps) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null as Transaction | null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="mx-auto max-w-3xl px-5">
      <div className="mb-8 flex justify-center md:justify-normal">
        <h1 className="gradient-title text-5xl">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
