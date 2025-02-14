"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/lib/schema";
import { CURRENCY } from "@/lib/constant";
import { Form, FormDescription, FormLabel } from "./ui/form";
import { FieldWrapper, InputField, SelectField } from "./reusable-form-fields";
import { Loader2 } from "lucide-react";

type CreateAccountDrawerProps = {
  open?: boolean;
  children: React.ReactNode;
};

export function CreateAccountDrawer({
  open = false,
  children,
}: CreateAccountDrawerProps) {
  const [isOpen, setIsOpen] = useState(open);
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data: any) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      form.reset();
      setIsOpen(false);
    }
  }, [newAccount, form.reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InputField
                label="Account Name"
                id="name"
                name="name"
                control={form.control}
              />

              <SelectField
                label="Account Type"
                id="type"
                name="type"
                control={form.control}
                options={[
                  { value: "CURRENT", label: "Current" },
                  { value: "SAVINGS", label: "Savings" },
                ]}
              />

              <InputField
                label={`Initial Balance (in ${CURRENCY.CODE})`}
                id="balance"
                name="balance"
                control={form.control}
                type="number"
                step="0.01"
                placeholder="0.00"
              />

              <div className="mt-10 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel
                    htmlFor="isDefault"
                    className="cursor-pointer text-base">
                    Set as Default
                  </FormLabel>
                  <FormDescription className="text-sm">
                    This account will be selected by default for transactions
                  </FormDescription>
                </div>
                <FieldWrapper
                  control={form.control}
                  name="isRecurring"
                  render={(field) => (
                    <Switch
                      id="isDefault"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createAccountLoading}>
                  {createAccountLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
