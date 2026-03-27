export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-black text-white p-4">Admin Sidebar</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
