import { Fragment, useState, useEffect } from 'react';
import './index.css';
import Modal from './components/Modal';
import axios from 'axios';

export default function Table() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);  // State untuk menyimpan data pengguna

  useEffect(() => {
    // Mengambil data pengguna dari backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_users');
        setUsers(response.data);  // Menyimpan data yang diterima ke state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);  // Menjalankan sekali ketika komponen dimuat

  return (
    <Fragment>
      <div className='pt-14 pr-40 pl-40 h-screen bg-gray-100'>
          <div className="mb-4 flex flex-col">
            <nav className="text-gray-500 text-sm mb-2">
              <span>Categories</span> <span className="mx-1">›</span> <span>Create</span>
            </nav>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold">Client</h1>
              <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Input</button>
            </div>
          </div>
        <div className='rounded-lg overflow-auto shadow'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
              <tr>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>No.</th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>Nama</th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>Username</th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>IP Address</th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left w-1/3'>Alamat</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className='p-3 text-sm text-gray-700'>{index + 1}</td>
                    <td className='p-3 text-sm text-gray-700'>{user.nama}</td> {/* Nama */}
                    <td className='p-3 text-sm text-gray-700'>{user.username}</td> {/* Username */}
                    <td className='p-3 text-sm text-gray-700'>{user.ip}</td> {/* IP Address */}
                    <td className='p-3 text-sm text-gray-700'>{user.alamat}</td> {/* Alamat */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-sm text-gray-700 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isvisible={showModal} onClose={() => setShowModal(false)} />
    </Fragment>
  );
}
