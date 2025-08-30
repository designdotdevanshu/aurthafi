"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { formatCurrency } from "@/lib/constant";

interface Budget {
  amount: number;
}

interface BudgetProgressProps {
  initialBudget: Budget;
  currentExpenses: number;
}

export function BudgetProgress({
  initialBudget,
  currentExpenses,
}: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || "",
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch<{
    amount?: number;
    success?: boolean;
  }>(updateBudget);

  const percentUsed = initialBudget?.amount
    ? Math.min((currentExpenses / initialBudget.amount) * 100, 100)
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  // Keyboard shortcut to toggle editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "b" && e.ctrlKey) {
        e.preventDefault();
        setIsEditing((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account) (
            <kbd className="rounded bg-gray-100 p-1">⌘</kbd> +{" "}
            <kbd className="rounded bg-gray-100 p-1">B</kbd>)
          </CardTitle>
          <div className="mt-1 flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateBudget();
                    if (e.key === "Escape") handleCancel();
                  }}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}>
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}>
                  <X className="size-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `${formatCurrency(currentExpenses)} of ${formatCurrency(initialBudget.amount)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="size-6">
                  <Pencil className="size-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={
                percentUsed > 100 ? 100 : parseFloat(percentUsed.toFixed(1))
              }
              extraStyles={`${
                // add to Progress component
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                    ? "bg-orange-500"
                    : percentUsed >= 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
              }`}
            />
            <p className="text-right text-xs text-muted-foreground">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
