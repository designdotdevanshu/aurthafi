export const dynamic = "force-dynamic";

import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction, Transaction } from "@/actions/transaction";
import { AddTransactionForm } from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";

type AddTransactionPageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function AddTransactionPage({
  searchParams,
}: AddTransactionPageProps) {
  const accounts = await getUserAccounts();
  const editId = (await searchParams)?.edit;

  let initialData = null as Transaction | null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  const title = editId ? "Edit Transaction" : "Add Transaction";

  return (
    <div className="mx-auto max-w-3xl px-5">
      <div className="mb-8 flex justify-center md:justify-normal">
        <h1 className="gradient-title text-5xl">{title}</h1>
      </div>
      <AddTransactionForm
        editId={editId}
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
