"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends PageView on client navigations. The first view is sent by the base snippet. */
export default function MetaPageViews() {
    const pathname = usePathname();
    const isFirstView = useRef(true);

    useEffect(() => {
        if (isFirstView.current) {
            isFirstView.current = false;
            return;
        }
        window.fbq?.("track", "PageView");
    }, [pathname]);

    return null;
}
