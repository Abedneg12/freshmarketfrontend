export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div>
        <h4 className="font-bold mb-2 text-white">Freshmarket</h4>
        <p>
          Your neighborhood's online grocery store. Fresh products, delivered to
          your door.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-2 text-white">Shop</h4>
        <ul className="space-y-1">
          <li>Produce</li>
          <li>Dairy & Eggs</li>
          <li>Meat & Seafood</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-2 text-white">About</h4>
        <ul className="space-y-1">
          <li>Our Story</li>
          <li>Careers</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-2 text-white">Help</h4>
        <ul className="space-y-1">
          <li>FAQs</li>
          <li>Shipping</li>
        </ul>
      </div>
      <p className="text-center text-sm mt-6">
        &copy; {new Date().getFullYear()} Freshmarket. All rights reserved.
      </p>
    </footer>
  );
}
