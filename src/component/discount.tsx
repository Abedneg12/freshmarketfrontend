import Image from "next/image";

const deals = [
  {
    id: 1,
    name: "Fresh Blueberries",
    qty: "0,34 kg",
    price: "Rp 73.000",
    oldPrice: "Rp 114.000",
    img: "/Fresh-Blueberries.jpg",
    discount: "20% OFF",
  },
  {
    id: 2,
    name: "Grass-Fed Ground Beef",
    qty: "1 kg",
    price: "Rp 106.000",
    oldPrice: "Rp 147.000",
    img: "/Grass-Fed-Ground-Beef.jpg",
    discount: "27% OFF",
  },
  {
    id: 1,
    name: "Organic Baby Spinach",
    qty: "140 g",
    price: "Rp 57.000",
    oldPrice: "Rp 73.000",
    img: "/Organic-Baby-Spinach.jpg",
    discount: "30% OFF",
  },
];

export default function Discounts() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6x1 mx-auto px-4">
        <h2 className="text-2x1 font-bold mb-6 text-center">Weekly Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((d) => (
            <div
              key={d.id}
              className="border rounded-lg overflow-hidden shadow"
            >
              <div className="relative h-48">
                <Image src={d.img} alt={d.name} fill className="object-cover" />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  {d.discount}
                </span>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.qty}</p>
                <div className="flex justify-center items-baseline gap-2 my-2">
                  <span className="line-through text-gray-400">
                    {d.oldPrice.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-bold">
                    {d.price.toLocaleString()}
                  </span>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-100">
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
}
