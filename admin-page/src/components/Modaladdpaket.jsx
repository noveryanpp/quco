import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modaladdpaket = ({ visible, onClose }) => {
  const [nama, setNama] = useState('');
  const [kecepatan, setKecepatan] = useState('');
  const [harga, setHarga] = useState('');
  const [masa_aktif, setMasa_aktif] = useState('');
  const navigate = useNavigate(); // Menambahkan useNavigate

  if (!visible) return null;

  const handleSubmitpkt = async (e) => {
    e.preventDefault();
    const addPaket = { nama, kecepatan, harga, masa_aktif };
  
    try {
      const response = await axios.post('http://localhost:5000/add_paket', addPaket);
      console.log(response.data);
      
      setNama('');
      setKecepatan('');
      setHarga('');
      setMasa_aktif('');
      onClose();
      navigate("/paket");
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menambahkan paket, coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2D383C] text-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <h2 className="text-2xl font-bold text-center mb-4">Tambah Paket</h2>
        <form onSubmit={handleSubmitpkt}>
          <label className="block mb-2 font-semibold text-base">Nama Paket</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Nama Paket" value={nama} onChange={(e) => setNama(e.target.value)}/>
          
          <label className="block mb-2 font-semibold text-base">Kecepatan</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Kecepatan" value={kecepatan} onChange={(e) => setKecepatan(e.target.value)}/>
          
          <label className="block mb-2 font-semibold text-base">Harga</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Harga" value={harga} onChange={(e) => setHarga(e.target.value)}/>
          
          <label className="block mb-2 font-semibold text-base">Masa Aktif</label>
          <input type="text" className="w-full p-2 mb-4 rounded bg-[#414C50] text-white" placeholder="Masa Aktif" value={masa_aktif} onChange={(e) => setMasa_aktif(e.target.value)}/>
          
          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Tutup</button>
            <button type="submit" className="px-4 py-2 bg-[#39ACE7] text-white rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modaladdpaket;
