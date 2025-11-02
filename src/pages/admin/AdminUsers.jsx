import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../../store/slices/authSlice';
import { Loader, User, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser({userId: id}));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={'/admin/dashboard'} className="flex text-blue-500 text-md mb-2.5" > <ArrowLeft/> <span className="font-medium">Back to dashboard</span> </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{user.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{user.role}</td>
                  <td className="py-4 px-6 flex space-x-3">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
