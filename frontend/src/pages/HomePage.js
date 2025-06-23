import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen">
        <div className="absolute top-0 w-full h-full bg-black opacity-30"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="items-center justify-center flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl mb-6">
                  Welcome to M2DG Basketball Platform
                </h1>
                <p className="mt-4 text-lg text-gray-200 leading-relaxed">
                  Your ultimate destination for basketball court booking, tournaments, 
                  team management, and competitive play. Join the community of basketball 
                  enthusiasts and take your game to the next level.
                </p>
                
                <div className="mt-12 flex justify-center space-x-4">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/guest"
                        className="bg-transparent hover:bg-white hover:text-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg border-2 border-white transition duration-300"
                      >
                        Browse as Guest
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-gray-800">
                Everything You Need for Basketball
              </h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                From booking courts to organizing tournaments, M2DG has all the features 
                to manage your basketball activities in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap">
            {/* Feature 1 */}
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-orange-400">
                    🏀
                  </div>
                  <h6 className="text-xl font-semibold">Court Booking</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Book premium basketball courts with easy online scheduling and instant confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    🏆
                  </div>
                  <h6 className="text-xl font-semibold">Tournaments</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Join competitive tournaments, track brackets, and compete for prizes.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    👥
                  </div>
                  <h6 className="text-xl font-semibold">Team Management</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Create teams, invite players, and manage your basketball squad efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-white">
                Ready to Ball?
              </h2>
              <p className="text-lg leading-relaxed mt-4 mb-8 text-gray-300">
                Join thousands of basketball players who are already using M2DG to 
                organize their games, find opponents, and improve their skills.
              </p>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                  Join the Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;