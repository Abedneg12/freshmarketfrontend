import React from 'react';
interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
}
export const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFilterChange
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const filters = {
      store: formData.get('store'),
      month: formData.get('month'),
      category: formData.get('category')
    };
    onFilterChange(filters);
  };
  return <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Report Filters
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="store" className="block text-sm font-medium text-gray-700">
              Store
            </label>
            <select id="store" name="store" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
              <option value="">All Stores</option>
              <option value="1">Downtown Grocery</option>
              <option value="2">Westside Market</option>
              <option value="3">Northside Pantry</option>
              <option value="4">Eastside Deli</option>
              <option value="5">Central Mart</option>
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select id="month" name="month" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select id="category" name="category" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
              <option value="">All Categories</option>
              <option value="1">Produce</option>
              <option value="2">Dairy</option>
              <option value="3">Bakery</option>
              <option value="4">Meat & Seafood</option>
              <option value="5">Frozen Foods</option>
              <option value="6">Beverages</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Apply Filters
          </button>
        </div>
      </form>
    </div>;
};