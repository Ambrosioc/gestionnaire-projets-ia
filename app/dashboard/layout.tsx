import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r">
        <Sidebar />
      </div>
      <main className="lg:pl-72 w-full">
        <div className="px-4 py-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}