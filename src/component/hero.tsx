"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  {
    id: 1,
    title: "Fresh Groceries Delivered to Your Door",
    img: "/banner-1.jpg",
  },
  { id: 2, title: "Shop with Ease & Speed", img: "/banner-2.jpeg" },
];

export default function Hero() {
  return (
    <section className="bg-green-50 py-12 overflow-y-auto">
      <div className="max-w-6x1 mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-4">
            Fresh Groceries Delivered to Your Door
          </h1>
          <p className="text-gray-700 mb-6">
            Shop from thousands of fresh products and get them delivered.
          </p>
          <div className="space-x-4">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-100">
              View Stores
            </button>
          </div>
        </div>

        <div>
          <Swiper spaceBetween={20} slidesPerView={1} loop>
            {slides.map((s) => (
              <SwiperSlide key={s.id}>
                <div className="relative h-64 min-h-[200px] rounded-lg overflow-hidden shadow">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
