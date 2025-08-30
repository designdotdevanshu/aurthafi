export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="space-y-8 px-5">{children}</div>;
}
