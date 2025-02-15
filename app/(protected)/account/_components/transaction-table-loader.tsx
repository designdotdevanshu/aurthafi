import { Skeleton } from "@/components/ui/skeleton";

function TransactionTableLoader() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Skeleton className="absolute left-2 top-2.5 size-4 h-[24px] w-[24px]" />
          <div className="flex h-9 w-full border border-input px-3 py-1 pl-8 shadow-sm transition-colors file:border-0">
            <Skeleton className="h-[16px] w-[176px] max-w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="[&amp;>span]:line-clamp-1 flex h-9 w-[130px] items-center justify-between border border-input px-3 py-2 shadow-sm">
            <span>
              <Skeleton className="h-[16px] w-[72px] max-w-full" />
            </span>
            <Skeleton className="size-4 h-[24px] w-[24px]" />
          </div>
          <div className="[&amp;>span]:line-clamp-1 flex h-9 w-[150px] items-center justify-between border border-input px-3 py-2 shadow-sm">
            <span>
              <Skeleton className="h-[16px] w-[128px] max-w-full" />
            </span>
            <Skeleton className="size-4 h-[24px] w-[24px]" />
          </div>
        </div>
      </div>
      <div className="border">
        <div className="relative w-full overflow-auto">
          <table className="h-[16px] w-full caption-bottom">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors">
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 w-[50px] px-2 text-left align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 px-2 text-left align-middle">
                  <div className="flex items-center">
                    <Skeleton className="h-[16px] w-[32px] max-w-full" />
                    <Skeleton className="ml-1 size-4 h-[24px] w-[24px]" />
                  </div>
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 px-2 text-left align-middle">
                  <Skeleton className="h-[16px] w-[88px] max-w-full" />
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 px-2 text-left align-middle">
                  <div className="flex items-center">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                  </div>
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 px-2 text-right align-middle">
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-[16px] w-[48px] max-w-full" />
                  </div>
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 px-2 text-left align-middle">
                  <Skeleton className="h-[16px] w-[72px] max-w-full" />
                </th>
                <th className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] h-10 w-[50px] px-2 text-left align-middle"></th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[104px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[32px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[64px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[104px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[32px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[56px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[152px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[80px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[64px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[144px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[72px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[72px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[168px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[96px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[64px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[96px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[144px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[72px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[72px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[88px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[160px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[88px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[72px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[88px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[120px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[48px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[72px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[88px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[144px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[72px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[64px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors">
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="size-4 shrink-0 border border-primary"></div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[88px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <Skeleton className="h-[16px] w-[168px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <span className="px-2 py-1">
                    <Skeleton className="h-[16px] w-[96px] max-w-full" />
                  </span>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 text-right align-middle">
                  <Skeleton className="h-[16px] w-[64px] max-w-full" />
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="inline-flex items-center gap-1 border px-2.5 py-0.5 transition-colors">
                    <Skeleton className="h-[16px] w-[64px] max-w-full" />
                    <Skeleton className="size-3 h-[24px] w-[24px]" />
                  </div>
                </td>
                <td className="[&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] p-2 align-middle">
                  <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-8 items-center justify-center gap-2 p-0 transition-colors">
                    <Skeleton className="size-4 h-[24px] w-[24px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-9 items-center justify-center gap-2 border border-input shadow-sm transition-colors">
          <Skeleton className="lucide-chevron-left size-4 h-[24px] w-[24px]" />
        </div>
        <span>
          <Skeleton className="h-[16px] w-[88px] max-w-full" />
        </span>
        <div className="[&amp;_svg]:size-4 [&amp;_svg]:shrink-0 inline-flex size-9 items-center justify-center gap-2 border border-input shadow-sm transition-colors">
          <Skeleton className="lucide-chevron-right size-4 h-[24px] w-[24px]" />
        </div>
      </div>
    </div>
  );
}

export { TransactionTableLoader };
