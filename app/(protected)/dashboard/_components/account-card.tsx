"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useFetch } from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Account,
  AccountResponse,
  updateDefaultAccount,
} from "@/actions/account";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/constant";

export function AccountCard({ account }: { account: Account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch<AccountResponse>(updateDefaultAccount);

  const handleDefaultChange = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <TrendingUp className="mr-1 size-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <TrendingDown className="mr-1 size-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
