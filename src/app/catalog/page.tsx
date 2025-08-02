import { Suspense } from "react";
import CatalogContent from "@/pages/Catalog-page/Catalog";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}