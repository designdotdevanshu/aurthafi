export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex scroll-pt-20 justify-center py-40">{children}</div>
  );
}
