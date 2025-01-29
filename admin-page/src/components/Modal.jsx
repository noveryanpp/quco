import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ isvisible, onClose }) => {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');
  const [ip, setIp] = useState('');
  const [alamat, setAlamat] = useState('');

  if (!isvisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      nama,
      username,
      passwd,
      ip,
      alamat,
    };

    try {
      const response = await axios.post('http://localhost:5000/add_user', newUser);
      console.log(response.data);  // Menampilkan pesan sukses
      onClose();  // Menutup modal setelah berhasil
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="bg-black bg-opacity-25 backdrop-blur-sm rounded-lg p-4">
        <div className="w-[600px] bg-white shadow-lg rounded-lg flex flex-col p-6">
          <button className="text-black text-xl place-self-end" onClick={() => onClose()}>
            X
          </button>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="IP Address"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
            <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
