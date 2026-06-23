import React from 'react';
import { getOfferById } from '@/app/actions/offers';
import { notFound } from 'next/navigation';
import EditOfferClient from './EditOfferClient';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditOfferPage({ params }: Props) {
    const { id } = await params;
    const offerId = parseInt(id);
    
    if (isNaN(offerId)) notFound();

    const offer = await getOfferById(offerId);

    if (!offer) notFound();

    return <EditOfferClient offer={offer} />;
}
