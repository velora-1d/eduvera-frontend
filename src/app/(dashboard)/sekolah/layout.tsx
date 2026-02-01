import { SekolahSidebar } from "@/components/layouts/SekolahSidebar";

export default function SekolahLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <SekolahSidebar />
            <main className="flex-1 ml-64 bg-slate-950 min-h-screen">
                {children}
            </main>
        </div>
    );
}
