import { Fragment, useState, useEffect } from 'react';
import './index.css';
import { Search, User, Settings, LogOut } from "lucide-react";
import Modaladd from './components/Modaladd';
import Modalshow from './components/Modalshow';
import axios from 'axios';
import { io } from 'socket.io-client';
import logo from './assets/image/logo.png';

export default function Table() {
  const [showModaladd, setShowModaladd] = useState(false);
  const [showModalshow, setShowModalshow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(false);
  const usersPerPage = 7;

  // Fetch Data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    const handleUpdate = () => fetchData();
    socket.on('update_user', handleUpdate);
    socket.on('add_user', handleUpdate);
    socket.on('delete_user', handleUpdate);

    return () => {
      socket.off('update_user', handleUpdate);
      socket.off('add_user', handleUpdate);
      socket.off('delete_user', handleUpdate);
      socket.disconnect();
    };
  }, []);

  const filteredUsers = users.filter(user => 
    user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ip.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const lastindex = currentPage * usersPerPage;
  const firstindex = lastindex - usersPerPage;
  const currentUsers = filteredUsers.slice(firstindex, lastindex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <Fragment>
      <div className='pt-32 pr-40 pl-40 w-screen h-screen'>
        <div className="mb-4 flex flex-col">
          <div className="flex items-center space-x-2 relative">
            <img src={logo} alt="logo" className="w-44 absolute right-[88%] bottom-5" />
            <User 
              className="w-10 h-10 bottom-5 right-1 absolute text-white cursor-pointer hover:text-gray-300" 
              onClick={() => setOpenDropdown(!openDropdown)}
            />
            {openDropdown && (
              <div className="absolute right-0 bg-white shadow-md rounded-md w-36">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-black" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <h1 className="pl-5 text-3xl font-semibold">Pelanggan</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="bg-[#2D383C] text-left pl-10 pr-20 py-2 rounded-md placeholder:text-sm text-white w-full"
              />
            </div>
            <div className='pr-5'>              
              <button onClick={() => setShowModaladd(true)} className="bg-[#39ACE7] font-semibold text-white px-4 py-2 rounded-md">
                Tambah
              </button>
            </div>
          </div>
        </div>

        {/* Tabel data */}
        <div className='rounded-lg overflow-auto shadow'>
          <table className='w-full'>
            <thead className='bg-[#414C50] border-b-2 border-[#192428]'>
              <tr>
                <th className='p-3 text-white text-sm font-semibold tracking-wide text-left'>No.</th>
                <th className='p-3 text-white text-sm font-semibold tracking-wide text-left'>Nama</th>
                <th className='p-3 text-white text-sm font-semibold tracking-wide text-left'>Username</th>
                <th className='p-3 text-white text-sm font-semibold tracking-wide text-left'>IP Address</th>
                <th className='p-3 text-white text-sm font-semibold tracking-wide text-left w-1/3'>Alamat</th>
              </tr>
            </thead>
            <tbody className='bg-[#2D383C]'>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="bg-[#2D383C] hover:bg-[#414C50] cursor-pointer"  
                    onClick={() => { setSelectedUser(user); setShowModalshow(true); }}
                  >
                    <td className='p-3 text-sm text-white'>{firstindex + index + 1}</td>
                    <td className='p-3 text-sm text-white'>{user.nama}</td>
                    <td className='p-3 text-sm text-white'>{user.username}</td>
                    <td className='p-3 text-sm text-white'>{user.ip}</td>
                    <td className='p-3 text-sm text-white'>{user.alamat}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-sm text-white text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 bg-[#39ACE7] text-white rounded disabled:bg-[#2D383C]" disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#414C50] text-white" : "bg-[#2D383C] text-white" }`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 bg-[#39ACE7] text-white rounded disabled:bg-[#2D383C]" disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      <Modaladd isvisible={showModaladd} onClose={() => { setShowModaladd(false); fetchData(); }} />
      {selectedUser && <Modalshow isVisible={showModalshow} user={selectedUser} onClose={() => setShowModalshow(false)} />}
    </Fragment>
  );
}
