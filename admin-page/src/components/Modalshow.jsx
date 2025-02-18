import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Modalshow({ isVisible, onClose, user }) {
  if (!isVisible || !user) return null;

  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');
  const [ip, setIp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [notelp, setNotelp] = useState('');

  useEffect(() => {
    if (user) {
      setNama(user.nama || '');
      setUsername(user.username || '');
      setPasswd(user.passwd || '');
      setIp(user.ip || '');
      setAlamat(user.alamat || '');
      setNotelp(user.notelp || '');
    }
  }, [user]);

  const handleSave = async () => {
    const updatedUser = { nama, username, passwd, ip, alamat, notelp };
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
          {[{ label: 'Nama', value: nama, setValue: setNama },
            { label: 'Username', value: username, setValue: setUsername },
            { label: 'Password', value: passwd, setValue: setPasswd, type: 'password' },
            { label: 'Alamat IP', value: ip, setValue: setIp },
            { label: 'Alamat', value: alamat, setValue: setAlamat },
            { label: 'No. Telepon', value: notelp, setValue: setNotelp }].map(({ label, value, setValue, type = 'text' }, index) => (
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