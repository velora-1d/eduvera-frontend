import { PesantrenSidebar } from "@/components/layouts/PesantrenSidebar";

export default function PesantrenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <PesantrenSidebar />
            <main className="flex-1 ml-64 bg-slate-950 min-h-screen">
                {children}
            </main>
        </div>
    );
}
