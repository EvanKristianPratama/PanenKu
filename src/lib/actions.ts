'use server';

import { mongoService } from "@/services/mongoService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock"));
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const farmer = formData.get("farmer") as string;
    const location = formData.get("location") as string;
    const imageInput = formData.get("image") as string;

    // Use provided image URL or fallback to placeholder
    const image = imageInput && imageInput.trim()
        ? imageInput.trim()
        : "https://images.unsplash.com/photo-1595855701120-83bb084969dd?q=80&w=500&auto=format&fit=crop";

    await mongoService.addProduct({
        name,
        price,
        category,
        stock,
        unit,
        description,
        farmer,
        location,
        image
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    await mongoService.deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/");
}
