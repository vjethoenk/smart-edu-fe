export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-blue-500 text-white p-4">Teacher Sidebar</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
