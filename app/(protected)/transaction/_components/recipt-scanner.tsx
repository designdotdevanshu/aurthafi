"use client";

import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";

export function ReceiptScanner({
  onScanComplete,
}: {
  onScanComplete: (data: {
    amount: number;
    date: string;
    description: string;
    category: string;
  }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await scanReceiptFn(formData);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(
        scannedData as {
          amount: number;
          date: string;
          description: string;
          category: string;
        },
      );
      toast.success("Receipt scanned successfully");
    }
  }, [scanReceiptLoading, scannedData]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="animate-gradient h-10 w-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white transition-opacity hover:text-white hover:opacity-90"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}>
        {scanReceiptLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}
