import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Modaladd = ({ isvisible, onClose }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');
  const [mac, setMac] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  if (!isvisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adduser = { name, username, password, ip, mac, address, phone };
  
    try {
      const response = await axios.post('http://localhost:5000/add_user', adduser);
      console.log(response.data);
      onClose();
      navigate("/table");
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
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Username</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Password</label>
          <input type="password" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">Alamat IP</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Alamat IP" value={ip} onChange={(e) => setIp(e.target.value)} />
          
          <label className="block mb-2 font-semibold text-base">MAC</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="MAC" value={mac} onChange={(e) => setMac(e.target.value)} />

          <label className="block mb-2 font-semibold text-base">No. Telepon</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
             
          <label className="block mb-2 font-semibold text-base">Alamat</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Alamat" value={address} onChange={(e) => setAddress(e.target.value)} />
          
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