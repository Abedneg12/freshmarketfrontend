'use client';

import React from 'react';
export const Hero = () => {
  return <section className="relative bg-green-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Fresh Groceries <br />
            <span className="text-green-600">Delivered to Your Door</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Shop from thousands of fresh products and get them delivered in as
            little as 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-colors text-lg">
              Get Started
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-medium transition-colors text-lg">
              View Stores
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 relative">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" alt="Fresh groceries" className="rounded-lg shadow-xl object-cover h-80 md:h-96 w-full" />
          <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800">Free Delivery</p>
                <p className="text-sm text-gray-500">On your first order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>;
};