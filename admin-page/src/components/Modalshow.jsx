import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Modalshow({ isVisible, onClose, user }) {
  if (!isVisible || !user) return null;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');
  const [mac, setMac] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setPassword(user.password || '');
      setIp(user.ip || '');
      setMac(user.mac || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    const updatedUser = { name, username, password, ip, mac, address, phone };
    try {
      await axios.put(`http://localhost:5000/update_user/${user.id}`, updatedUser);
      console.log('Data berhasil diperbarui');
      onClose();
    } catch (error) {
      console.error('Gagal memperbarui data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete_user/${user.id}`);
      console.log('User berhasil dihapus');
      onClose();
    } catch (error) {
      console.error('Gagal menghapus user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#2D383C] p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-white">Edit Pelanggan</h2>
        <div className="space-y-4">
          {[{ label: 'Nama', value: name, setValue: setName },
            { label: 'Username', value: username, setValue: setUsername },
            { label: 'Password', value: password, setValue: setPassword },
            { label: 'Alamat IP', value: ip, setValue: setIp },
            { label: 'Alamat MAC', value: mac, setValue: setMac },
            { label: 'Alamat', value: address, setValue: setAddress },
            { label: 'No. Telepon', value: phone, setValue: setPhone }].map(({ label, value, setValue, type = 'text' }, index) => (
            <div key={index}>
              <label className="block mb-1 font-semibold text-base text-white">{label}</label>
              <input type={type} className="w-full p-2 rounded bg-[#414C50] text-white" value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Tutup</button>
          <div className="flex justify-end gap-2">
            <button onClick={handleDelete} className="px-4 py-2 bg-red-700 text-white rounded">Hapus</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#39ACE7] text-white rounded">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}