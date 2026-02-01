// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/utils/serverAuth';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  // Convert to plain object for client component
  const plainUser = JSON.parse(JSON.stringify(user));

  return <DashboardShell user={plainUser}>{children}</DashboardShell>;
}