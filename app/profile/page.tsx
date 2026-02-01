import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import ProfileEditor from '@/components/profile/ProfileEditor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Edit Profile - Eco Sakshi',
};

export default async function ProfilePage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sage-50 to-white pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileEditor user={plainUser} />
        </div>
      </main>
      <Footer />
    </>
  );
}