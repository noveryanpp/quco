import React, { useState } from 'react';
import axios from 'axios';

const Modaladd = ({ isvisible, onClose }) => {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');
  const [ip, setIp] = useState('');
  const [alamat, setAlamat] = useState('');

  if (!isvisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adduser = { nama, username, passwd, ip, alamat };
  
    try {
      const response = await axios.post('http://localhost:5000/add_user', adduser);
      console.log(response.data);
      onClose();
      window.location.reload(); // Cara cepat (opsional)
      // ATAU gunakan prop callback untuk fetch data
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2D383C] text-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <h2 className="text-2xl font-bold text-center mb-4">Tambah Pengguna</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-base">Nama</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Username</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Password</label>
          <input type="password" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Password" value={passwd} onChange={(e) => setPasswd(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Alamat IP</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Alamat IP" value={ip} onChange={(e) => setIp(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Alamat</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
          
          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Tutup</button>
            <button type="submit" className="px-4 py-2 bg-[#39ACE7] text-white rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modaladd;
