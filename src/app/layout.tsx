import type { Metadata } from "next";
import { Zain } from "next/font/google";
import { SITE_NAME, SITE_NAME_AR, SITE_URL } from "@/lib/site";
import "./globals.css";

const zain = Zain({
    variable: "--font-zain",
    subsets: ["arabic"],
    weight: ["200", "300", "400", "700", "800", "900"],
});

export const metadata: Metadata = {

    metadataBase: new URL(SITE_URL),

    title: {
        default: "Leo Kids | ملابس أطفال أونلاين — متجر ليو كيدز",
        template: "%s | Leo Kids",
    },
    description:
        "عايز ملبس ولادك صح؟ 🧒👗 متجر ليو كيدز عنده أحدث كولكشنات ملابس الأطفال — مواليد، بنات وأولاد — قماش ناعم، ألوان زاهية، وأسعار مش هتلاقيها في أي حتة تانية. اطلب دلوقتي والتوصيل لباب البيت!",

    keywords: [
        "ملابس اطفال اونلاين مصر",
        "ملابس اطفال بنات",
        "ملابس اطفال اولاد",
        "ملابس مواليد",
        "ملابس اطفال رخيصة",
        "ملابس اطفال جملة",
        "كولكشن اطفال 2025",
        "ليو كيدز",
        "Leo Kids",
        "leo-kids.com",
        "ملبس الطفل",
        "ملابس اطفال قطن",
        "ملابس اطفال فرنسي",
        "بيبي شوب اونلاين مصر",
        "ملابس حديثي الولادة",
        "توصيل ملابس اطفال مصر",
    ],

    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,

    openGraph: {
        type: "website",
        locale: "ar_EG",
        alternateLocale: "en_US",
        url: SITE_URL,
        siteName: "Leo Kids | ليو كيدز",
        title: "Leo Kids | ألبس طفلك أحلى كولكشن — توصيل لحد بيتك ",
        description:
            "من المواليد لحد سن 20 سنة — ملابس ناعمة وأنيقة بأسعار تبسّط. اطلب دلوقتي على leo-kids.com!",
    },

    twitter: {
        card: "summary_large_image",
        title: "Leo Kids | ملابس أطفال بجودة عالية وأسعار تبهجك",
        description:
            "بنات وأولاد ومواليد — كولكشنات جديدة كل أسبوع. اطلب على leo-kids.com وهنوصلك لحد بيتك في أي محافظة!",
        images: [`${SITE_URL}/og-image.jpg`],
        creator: "@LeoKidsEG",
        site: "@LeoKidsEG",
    },

    alternates: {
        canonical: SITE_URL,
        languages: {
            "ar-EG": SITE_URL,
            "en-US": SITE_URL,
        },
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    applicationName: "Leo Kids",
    referrer: "origin-when-cross-origin",

    icons: {
        icon: "/fav.png",
        shortcut: "/fav.png",
        apple: "/fav.png",
    },
};

import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ar"
            dir="rtl"
            className={`${zain.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                {children}
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
