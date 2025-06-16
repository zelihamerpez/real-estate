import { useState } from 'react';
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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

      const res = await fetch('http://localhost:3000/api/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized!");

      const data = await res.json();
      console.log(data);

      router.push("/welcome");
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className=" sm:flex justify-center items-center">      
      <form id= "login" onSubmit={handleLogin}>
        <div className="sm:flex items-start p-0 gap-[30px] w-full h-[60px] relative">
          Use email address and password to login! <br />
          Example: email: <code>user1@example.com</code>, password: <code>test1234</code>
        </div>
        
        <div className="sm:flex flex-col items-start p-0 gap-[20px] w-full mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            type="submit"
            className="flex justify-center items-center py-[15px] px-[35px] bg-[#3361FF] hover:bg-[#11266e] rounded-[30px] capitalize text-white mt-4"
          >
            Login
          </button>
        </div>
      </form>


      
      
    </div>
  );
};

export default HomePage;
