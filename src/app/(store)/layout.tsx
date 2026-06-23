import Navbar from "@/components/store/Navbar";
import TopNavbar from "@/components/store/TopNavbar";
import Footer from "@/components/store/Footer";
import CartSync from "@/components/store/CartSync";
import JsonLd from "@/components/seo/JsonLd";
import { getSettings } from "@/app/actions/settings";
import { SITE_NAME, SITE_NAME_AR, absoluteUrl } from "@/lib/site";

/** Settings are cached (1h); pages can still revalidate independently. */
export const revalidate = 3600;

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        alternateName: SITE_NAME_AR,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/logo.png'),
    };

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd data={organizationJsonLd} />
            <CartSync />
            <TopNavbar settings={settings} />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
        </div>
    );
}
