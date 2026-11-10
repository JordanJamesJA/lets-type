
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductDetails from "./product-details";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
