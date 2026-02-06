'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/admin/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuthComponent.displayName = `withAuth(${displayName})`;

  return WithAuthComponent;
};

export default withAuth;
