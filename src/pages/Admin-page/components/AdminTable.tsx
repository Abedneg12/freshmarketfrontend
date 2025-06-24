import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  stores: string[];
  status: 'active' | 'inactive';
}
const mockAdmins: Admin[] = [{
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Store Admin',
  stores: ['Toko utama', 'Toko cabang'],
  status: 'active'
}, {
  id: '2',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'Store Admin',
  stores: ['Toko utama'],
  status: 'active'
}, {
  id: '3',
  name: 'Robert Johnson',
  email: 'robert.johnson@example.com',
  role: 'Store Admin',
  stores: ['Toko jaktim'],
  status: 'active'
}, {
  id: '4',
  name: 'Lisa Brown',
  email: 'lisa.brown@example.com',
  role: 'Store Admin',
  stores: ['Toko jakpus'],
  status: 'inactive'
}, {
  id: '5',
  name: 'Mike Wilson',
  email: 'mike.wilson@example.com',
  role: 'Store Admin',
  stores: ['Toko pusat'],
  status: 'active'
}];
interface AdminTableProps {
  onEdit: (admin: Admin) => void;
  onDelete: (adminId: string) => void;
}
export const AdminTable: React.FC<AdminTableProps> = ({
  onEdit,
  onDelete
}) => {
  const [admins] = useState<Admin[]>(mockAdmins);
  return <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stores
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map(admin => <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {admin.stores.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onEdit(admin)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDelete(admin.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};