'use client';

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
import { toast } from "sonner";
import { showAlert } from "@/lib/sweetalert";
import { useTransition } from "react";

export function DeleteProductButton({ id, name }: { id: string | number, name: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        const confirmed = await showAlert.confirm(
            'Hapus Produk?',
            `Anda yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`
        );

        if (confirmed) {
            startTransition(async () => {
                await deleteProduct(String(id));
                showAlert.success('Berhasil', `Produk ${name} telah dihapus.`);
            });
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-800 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}

// Test ke dev 
