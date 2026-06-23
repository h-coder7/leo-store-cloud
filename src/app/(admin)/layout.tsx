import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-font-scale min-h-screen flex" dir="rtl">
            <Sidebar />
            <main className="flex-1 bg-slate-50 dark:bg-slate-950 pt-16 lg:pt-0 lg:pr-64 min-h-screen transition-all duration-300 flex flex-col">
                <Topbar />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
