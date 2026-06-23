"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LeadStatus = 'pending' | 'completed' | 'abandoned';

export interface LeadData {
    id: string;
    name?: string;
    phone?: string;
    status?: LeadStatus;
    created_at?: string;
    updated_at?: string;
}

export async function upsertLead(lead: LeadData) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('leads')
        .upsert({
            ...lead,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting lead:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .update({ 
            status,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating lead status:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
}

export async function getLeads(): Promise<LeadData[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        return [];
    }

    return data as LeadData[];
}

export async function deleteLead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/leads');
    return { success: true };
}
