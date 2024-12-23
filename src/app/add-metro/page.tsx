'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsSuperUser } from '@/hooks/useIsSuperUser';

const AddMetro: React.FC = () => {
    const [isSuperUser, loading] = useIsSuperUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isSuperUser === false) {
            router.push('/404');
        }
    }, [loading, isSuperUser, router]);

    if (loading || isSuperUser === false) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Add Metro</h1>
            {isSuperUser !== null && (
                <p>{isSuperUser ? 'You are a superuser' : 'You are not a superuser'}</p>
            )}
        </div>
    );
};

export default AddMetro;