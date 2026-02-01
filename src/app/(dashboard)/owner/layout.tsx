import { OwnerSidebar } from "@/components/layouts/OwnerSidebar";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <OwnerSidebar />
            <main className="flex-1 ml-64 bg-slate-950 min-h-screen">
                {children}
            </main>
        </div>
    );
}
