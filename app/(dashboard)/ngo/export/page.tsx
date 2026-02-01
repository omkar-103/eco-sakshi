import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import ExportDataPanel from '@/components/ngo/ExportDataPanel';
import { Download } from 'lucide-react';

export const metadata = {
  title: 'Export Data - NGO',
};

export default async function NgoExportPage() {
  const user = await getServerSession();

  if (!user || !['ngo', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <Download className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Export Data
          </h1>
          <p className="text-sage-600 mt-1">
            Download environmental data in various formats.
          </p>
        </div>
      </div>

      <ExportDataPanel />
    </div>
  );
}