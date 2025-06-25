import Image from "next/image";

const bestSellers = [
  {
    id: 1,
    name: "Organic Avocados",
    qty: "2 pcs",
    price: "Rp 73.000",
    img: "/Organic-Avocados.jpg",
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    qty: "0,45 kg",
    price: "Rp 57.000",
    img: "/Fresh-Strawberries.jpg",
  },
  {
    id: 1,
    name: "Organic Chicken Breast",
    qty: "1 kg",
    price: "Rp 163.000",
    img: "/Organic-Chicken-Breast.jpg",
  },
  {
    id: 1,
    name: "Sourdough Bread",
    qty: "1 loaf",
    price: "Rp 89.000",
    img: "/Sourdough-Bread.jpg",
  },
];

export default function BestSellers() {
  return (
    <section className="py-12">
      <div className="max-w-6x1 mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2x1 font-bold">Best Sellers</h2>
          <a href="#" className="text-green-600 hover:underline">
            View all &gt;
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <div className="relative h-36">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.qty}</p>
                <p className="text-green-600 font-bold">
                  {p.price.toLocaleString()}
                </p>
                <button className="bg-green-100 text-green-600 rounded-full px-2 py-1 text-sm hover:bg-green-200">
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
