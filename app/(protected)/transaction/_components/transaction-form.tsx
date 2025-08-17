"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  createTransaction,
  Transaction,
  TransactionResponse,
  updateTransaction,
} from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import {
  FieldWrapper,
  InputField,
  SelectField,
} from "@/components/reusable-form-fields";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Account } from "@/actions/account";
import { Category } from "@/data/categories";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constant";
import { transactionSchema } from "@/lib/schema";
import { CalendarIcon, Loader2 } from "lucide-react";

type AddTransactionFormProps = {
  accounts: Account[] | null;
  categories: Category[];
  editMode?: boolean;
  initialData?: Transaction | null;
};

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}: AddTransactionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description || "",
            financialAccountId: initialData.financialAccountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            financialAccountId: accounts?.find((ac) => ac.isDefault)?.id,
            category: "",
            date: new Date(),
            isRecurring: false,
            recurringInterval: "DAILY",
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch<TransactionResponse>(
    editMode ? updateTransaction : createTransaction,
  );

  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount.toString()),
    };
    if (editMode) transactionFn(editId, formData);
    else transactionFn(formData);
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      );
      form.reset();
      router.push(`/account/${transactionResult.data.financialAccountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = form.watch("type");
  const isRecurring = form.watch("isRecurring");
  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SelectField
          control={form.control}
          name="type"
          label="Type"
          options={[
            { value: "EXPENSE", label: "Expense" },
            { value: "INCOME", label: "Income" },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            control={form.control}
            name="amount"
            label="Amount"
            type="number"
            placeholder="0.00"
          />

          <SelectField
            control={form.control}
            name="accountId"
            label="Account"
            options={
              accounts?.map((account) => ({
                value: account.id,
                label: `${account.name} (${formatCurrency(account.balance)})`,
              })) || []
            }>
            <CreateAccountDrawer>
              <Button
                variant="ghost"
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                )}>
                Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectField>
        </div>

        <SelectField
          control={form.control}
          name="category"
          label="Category"
          options={filteredCategories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />

        <FieldWrapper
          control={form.control}
          name="date"
          label="Date"
          render={(field) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full pl-3 text-left font-normal">
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => date && field.onChange(date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />

        <InputField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Enter description"
        />

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Recurring Transaction</FormLabel>
            <FormDescription>
              Set up a recurring schedule for this transaction
            </FormDescription>
          </div>
          <FieldWrapper
            control={form.control}
            name="isRecurring"
            render={(field) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {isRecurring && (
          <SelectField
            control={form.control}
            name="recurringInterval"
            label="Recurring Interval"
            options={[
              { value: "DAILY", label: "Daily" },
              { value: "WEEKLY", label: "Weekly" },
              { value: "MONTHLY", label: "Monthly" },
              { value: "YEARLY", label: "Yearly" },
            ]}
          />
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={transactionLoading}>
            {transactionLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "Update Transaction"
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
