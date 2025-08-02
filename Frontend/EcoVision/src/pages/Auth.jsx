import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import bgImage from '../assets/images/2-bg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Auth = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [nin, setNin] = useState('');
  const [state, setState] = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleToggle = () => {
    setLogin(!login);
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!login && (!email || !firstName || !lastName || !state || !municipality))) {
      setError('Please fill in all required fields');
      return;
    }

    if (!login && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!login && userType === 'buyer' && !nin) {
      setError('Please enter your NIN');
      return;
    }

    try {
      let res;

      if (login) {
        res = await axios.post('http://127.0.0.1:8000/api/login/', {
          username,
          password,
        });
        console.log("Login response:", res.data);

      } else {
        const payload = {
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
          userType,
          nin,
          state,
          municipality,
        };

        res = await axios.post('http://127.0.0.1:8000/api/register/', payload);
      }

      localStorage.setItem('token', res.data.access);
      localStorage.setItem('user_type', res.data.user_type);
      localStorage.setItem('username', res.data.username);

      if (res.data.user_type === 'buyer') {
        navigate('/buyer');
      } else if (res.data.user_type === 'seller') {
        navigate('/seller');
      } 

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };
  const algerianStates = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
    'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
    'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'Msila', 'Mascara',
    'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf',
    'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
    'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
    'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', "El M'Ghair", 'El Menia'
  ];

  return (
    <>
      <p className="bg-logoGreen text-white font-extrabold text-5xl py-4 px-11 tracking-widest uppercase" data-aos="fade-down">
        Welcome to EcoVision
      </p>

      <div className="min-h-screen flex items-center justify-center bg-[#f3fdf3] px-6 sm:px-12">
        <div data-aos="fade-right" className="hidden md:block mr-8">
          <img src={bgImage} alt="icon" className="w-[520px] h-auto" />
        </div>

        <div key={login ? 'login' : 'signup'} className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-96" data-aos="fade-left">
          <h2 className="text-2xl font-bold text-center mb-6 text-logoGreen tracking-widest">
            {login ? 'Login' : 'Sign Up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Sign Up Fields */}
            {!login && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">User Type</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value="buyer"
                        checked={userType === 'buyer'}
                        onChange={() => setUserType('buyer')}
                      />
                      <span className="text-gray-700">Buyer</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value="seller"
                        checked={userType === 'seller'}
                        onChange={() => setUserType('seller')}
                      />
                      <span className="text-gray-700">Seller</span>
                    </label>
                  </div>
                </div>

                {userType === 'buyer' && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">NIN (ID Number)</label>
                    <input
                      type="text"
                      placeholder="Enter your ID number"
                      className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                      value={nin}
                      onChange={(e) => setNin(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">State</label>
                  <select
                    className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">Select your state</option>
                    {algerianStates.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Municipality</label>
                  <input
                    type="text"
                    placeholder="Your municipality"
                    className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!login && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-logoGreen rounded-md focus:outline-none focus:ring-2 focus:ring-logoGreen"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-logoGreen hover:bg-logoGreenDark text-white font-semibold py-2 px-4 rounded-md transition tracking-widest"
              >
                {login ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {login ? (
              <>
                Don’t have an account?{' '}
                <button
                  onClick={handleToggle}
                  className="text-logoGreen hover:text-logoGreenDark hover:underline transition"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={handleToggle}
                  className="text-logoGreen hover:text-logoGreenDark hover:underline transition"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
