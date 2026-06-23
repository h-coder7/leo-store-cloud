import Navbar from "@/components/store/Navbar";
import TopNavbar from "@/components/store/TopNavbar";
import Footer from "@/components/store/Footer";
import { getSettings } from "@/app/actions/settings";

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <div className="flex flex-col min-h-screen">
            <TopNavbar settings={settings} />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
        </div>
    );
}
