import React from 'react';
import { getSections } from '@/app/actions/products';
import AddProductClient from './AddProductClient';

export default async function AddProductPage() {
    const sections = await getSections();

    return <AddProductClient sections={sections} />;
}
