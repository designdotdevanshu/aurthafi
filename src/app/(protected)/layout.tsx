export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="container mx-auto my-32">{children}</div>;
}
