import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import ApiDashboard from '@/components/ngo/ApiDashboard';

export const metadata = {
  title: 'API Access - NGO Dashboard',
};

export default async function NgoApiPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'ngo' && user.role !== 'admin') {
    redirect('/citizen');
  }

  return <ApiDashboard />;
}