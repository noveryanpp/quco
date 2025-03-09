import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Modalshow({ Visible, onClose, paket }) {
  if (!Visible || !paket) return null;

  const [nama, setNama] = useState('');
  const [kecepatan, setKecepatan] = useState('');
  const [harga, setHarga] = useState('');
  const [masa_aktif, setMasa_aktif] = useState('');

  useEffect(() => {
    if (paket) {
      setNama(paket.nama || '');
      setKecepatan(paket.kecepatan || '');
      setHarga(paket.harga || '');
      setMasa_aktif(paket.masa_aktif || '');
    }
  }, [paket]);

  const handleSave = async () => {
    const updatedPaket = { nama, kecepatan, harga, masa_aktif};
    try {
      await axios.put(`http://localhost:5000/update_paket/${paket.id}`, updatedPaket);
      console.log('Data paket berhasil diperbarui');
      onClose();
    } catch (error) {
      console.error('Gagal memperbarui data paket:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete_paket/${paket.id}`);
      console.log('Paket berhasil dihapus');
      onClose();
    } catch (error) {
      console.error('Gagal menghapus paket:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#2D383C] p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-white">Edit Paket</h2>
        <div className="space-y-4">
          {[{ label: 'Nama Paket', value: nama, setValue: setNama },
            { label: 'Kecepatan', value: kecepatan, setValue: setKecepatan },
            { label: 'Harga', value: harga, setValue: setHarga },
            { label: 'Masa Aktif', value: masa_aktif, setValue: setMasa_aktif },].map(({ label, value, setValue, type = 'text' }, index) => (
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
