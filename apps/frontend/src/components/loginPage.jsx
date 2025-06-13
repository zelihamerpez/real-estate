
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // adjust the path if needed
import { useRouter } from "next/router";

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      console.log('Logged in. Token:', token);

      // Optionally: call backend API
      const res = await fetch('http://localhost:3000/api/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok){
        throw new Error("Unauthorized!");
      }

      const data = await res.json();
      console.log(data);

      router.push("/welc");

    } catch (err) {
      console.error('Login error:', err.message);
    }
  };

  return (
    <div className=" sm:flex justify-center items-center">
      
      <form id= "login" onSubmit={handleLogin}>
        <div className="sm:flex items-start p-0 gap-[30px] w-full h-[60px] relative">Use email address and password to login!</div>
        
        <div className="sm:flex items-start p-0 gap-[30px] w-full h-[60px] relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <button type="submit" 
          className="flex justify-center items-center py-[15px] px-[35px] bg-[#3361FF] hover:bg-[#11266e] rounded-[30px] capitalize text-white mt-7 sm:mt-0">Login</button>
        </div>
      </form>


      
      
    </div>
  );
};

export default HomePage;
