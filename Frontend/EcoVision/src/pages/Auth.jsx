import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import bgImage from '../assets/images/2-bg.png';
import api from '../lib/api';
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
        res = await api.post('/api/login/', {
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

        res = await api.post('/api/register/', payload);
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
    'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', "El M'Ghair", 'El Menia'"
  ];

  return (
    <div className="min-h-screen bg-[#f3fdf3] overflow-x-hidden">
      {/* Mobile-Responsive Header */}
      <div className="bg-logoGreen text-white font-extrabold text-center py-4 px-4 sm:px-8 md:px-11 tracking-widest uppercase" data-aos="fade-down">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl break-words">
          Welcome to EcoVision
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        
        {/* Background Image - Hidden on mobile, visible on larger screens */}
        <div data-aos="fade-right" className="hidden lg:block lg:mr-8 lg:flex-shrink-0">
          <img src={bgImage} alt="EcoVision Background" className="w-[400px] xl:w-[520px] h-auto" />
        </div>

        {/* Auth Form Container */}
        <div 
          key={login ? 'login' : 'signup'} 
          className="bg-white bg-opacity-95 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm xl:max-w-md" 
          data-aos="fade-left"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-logoGreen tracking-widest">
            {login ? 'Login' : 'Sign Up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Username */}
            <div className="mobile-form-group">
              <label className="mobile-form-label">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="mobile-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Sign Up Fields */}
            {!login && (
              <>
                <div className="mobile-form-group">
                  <label className="mobile-form-label">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="mobile-form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="mobile-form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mobile-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">User Type</label>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="buyer"
                        checked={userType === 'buyer'}
                        onChange={() => setUserType('buyer')}
                        className="w-4 h-4 text-logoGreen focus:ring-logoGreen"
                      />
                      <span className="text-gray-700 text-sm sm:text-base">Buyer</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="seller"
                        checked={userType === 'seller'}
                        onChange={() => setUserType('seller')}
                        className="w-4 h-4 text-logoGreen focus:ring-logoGreen"
                      />
                      <span className="text-gray-700 text-sm sm:text-base">Seller</span>
                    </label>
                  </div>
                </div>

                {userType === 'buyer' && (
                  <div className="mobile-form-group">
                    <label className="mobile-form-label">NIN (ID Number)</label>
                    <input
                      type="text"
                      placeholder="Enter your ID number"
                      className="mobile-form-input"
                      value={nin}
                      onChange={(e) => setNin(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="mobile-form-group">
                  <label className="mobile-form-label">State</label>
                  <select
                    className="mobile-form-select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  >
                    <option value="">Select your state</option>
                    {algerianStates.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">Municipality</label>
                  <input
                    type="text"
                    placeholder="Your municipality"
                    className="mobile-form-input"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="mobile-form-group">
              <label className="mobile-form-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mobile-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!login && (
              <div className="mobile-form-group">
                <label className="mobile-form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="mobile-form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="mobile-btn-primary"
              >
                {login ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {login ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={handleToggle}
                    className="text-logoGreen hover:text-logoGreenDark hover:underline transition font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={handleToggle}
                    className="text-logoGreen hover:text-logoGreenDark hover:underline transition font-medium"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
