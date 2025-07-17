import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/interface/product.type';
import axios from 'axios';
import { apiUrl } from '@/pages/config';

export default function ProductPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        if (id) {
            axios.get<Product>(`${apiUrl}/product/${id}`)
                .then(res => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setProduct(null);
                    setLoading(false);
                });
        } else {
            setProduct(null);
            setLoading(false);
        }
    }, [id]);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2 animate-pulse">
                        <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 h-20 w-20 rounded-lg"></div>)}
                        </div>
                    </div>
                    <div className="md:w-1/2 animate-pulse">
                        <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
                        <div className="bg-gray-200 h-6 w-1/4 rounded mb-6"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2 w-full"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2 w-full"></div>
                        <div className="bg-gray-200 h-4 rounded mb-6 w-3/4"></div>
                        <div className="bg-gray-200 h-12 rounded-lg mb-4"></div>
                        <div className="bg-gray-200 h-12 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Product Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                    Sorry, we couldn't find the product you're looking for.
                </p>
                <Link href="/catalog" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="text-gray-500 hover:text-green-600">
                                Home
                            </Link>
                        </li>
                        <li className="text-gray-500">/</li>
                        <li>
                            <Link href="/catalog" className="text-gray-500 hover:text-green-600">
                                Products
                            </Link>
                        </li>
                        <li className="text-gray-500">/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>
                {/* Product details */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product images */}
                    <div className="md:w-1/2">
                        <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                                src={product.images?.[selectedImage]?.imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {(product.images || []).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`h-20 w-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-green-500' : 'border-transparent'}`}
                                >
                                    <img src={img.imageUrl} alt={`${product.name} - view ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Product info */}
                    <div className="md:w-1/2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>
                        <div className="text-2xl font-bold text-green-600 mb-4">
                            Rp.{product.price?.toFixed(0) || product.basePrice?.toFixed(0)}
                        </div>
                        <p className="text-gray-600 mb-6">{product.description}</p>
                        {/* Quantity selector */}
                        <div className="flex items-center mb-6">
                            <span className="text-gray-700 mr-4">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100" disabled={quantity <= 1}>
                                    -
                                </button>
                                <span className="px-4 py-1 text-gray-800 font-medium">
                                    {quantity}
                                </span>
                                <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                                    +
                                </button>
                            </div>
                        </div>
                        {/* Add to cart button */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button className="flex-grow bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-medium transition-colors flex items-center justify-center">
                                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}