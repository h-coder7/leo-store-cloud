import React from 'react';
import { getLeads } from '@/app/actions/leads';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
    const leads = await getLeads();

    return <LeadsClient initialLeads={leads} />;
}
