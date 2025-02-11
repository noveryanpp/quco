import './index.css'
import logo from './assets/image/adada.png'
export default function Login(){
    return (
        <div className='flex flex-col items-center justify-center pt-28'>
            <img src={logo} alt="contoh" className='w-40'/>
            <form className="w-80 space-y-4 pt-14">
                <input type="text" placeholder="Username" className="w-full px-4 py-3 bg-[#2E3B43] text-white placeholder-[#414c50] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required/>
                <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-[#2E3B43] text-white placeholder-[#414c50] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required/>
                <button type="submit" className="w-full bg-[#38BDF8] text-[#ffffff] font-semibold py-3 rounded-md hover:bg-[#0EA5E9] transition duration-300">Masuk</button>
            </form>
            <p className="mt-6 text-sm text-white">www.quicknet.com</p>
        </div>
    )
}