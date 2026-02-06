'use client';

import withAuth from '@/components/admin/withAuth';
import { DJManagement } from '@/components/admin/DJManagement';
import { EventManagement } from '@/components/admin/EventManagement';
import { MerchManagement } from '@/components/admin/MerchManagement';
import { PhotoManagement } from '@/components/admin/PhotoManagement';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-10 space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-6xl font-black text-spotlight italic tracking-tighter">NR4 NINJAS</h1>
                <p className="text-white/40 uppercase tracking-[0.5em] text-xs">Administrative Command Center</p>
            </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                <DJManagement />
                <MerchManagement />
            </div>
            <div className="space-y-8">
                <EventManagement />
                <PhotoManagement />
            </div>
        </div>
    </div>
  );
}

export default withAuth(AdminDashboard);
