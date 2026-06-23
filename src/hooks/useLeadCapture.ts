"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { upsertLead, updateLeadStatus } from '@/app/actions/leads';

export function useLeadCapture() {
    const [leadId, setLeadId] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Initialize or Retrieve Session ID
    useEffect(() => {
        let storedId = localStorage.getItem('lead_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('lead_id', storedId);
        }
        // Reading the persisted lead id from localStorage is only possible after
        // mount, so this state sync inside the effect is intentional.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLeadId(storedId);
    }, []);

    // 2. Auto Save Logic (Debounced)
    // This function can be called directly from input onChange
    const autoSave = useCallback((name: string, phone: string) => {
        if (!leadId) return;

        // Don't save if both are empty
        if (!name && !phone) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
            await upsertLead({
                id: leadId,
                name: name,
                phone: phone,
                status: 'pending'
            });
        }, 1000); // 1s debounce
    }, [leadId]);

    const markAsCompleted = async () => {
        if (!leadId) return;
        await updateLeadStatus(leadId, 'completed');
    };

    return {
        autoSave,
        markAsCompleted,
        leadId
    };
}
