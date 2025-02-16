import { useState } from "react";
import logo from './assets/image/adada.png'
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg);
            }

            localStorage.setItem("token", data.access_token);
            onLoginSuccess();  // Update state
            navigate("/table"); // Arahkan ke halaman Table
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-28">
            <img src={logo} alt="contoh" className='w-40'/>
            {error && <p className="text-red-500">{error}</p>}
            <form className="w-80 space-y-4 pt-4" onSubmit={handleLogin}>
                <input type="text" placeholder="Username" className="w-full px-4 py-3 bg-[#2E3B43] text-white placeholder-[#414c50] rounded-md focus:ring-2 focus:ring-blue-400" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-[#2E3B43] text-white placeholder-[#414c50] rounded-md focus:ring-2 focus:ring-blue-400" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit" className="w-full bg-[#38BDF8] text-white font-semibold py-3 rounded-md hover:bg-[#0EA5E9] transition duration-300">Masuk</button>
            </form>
            <p className="mt-6 text-sm text-white">www.quicknet.com</p>
        </div>
    );
}
