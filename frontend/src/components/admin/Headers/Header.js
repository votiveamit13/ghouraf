const Header = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-8 pt-7 ">
      <div className="px-[40px] mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Total Users
              </h5>
              <span className="text-2xl font-bold text-gray-800">350,897</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white shadow">
              <i className="fas fa-chart-bar" />
            </div>
          </div>


          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                New Users
              </h5>
              <span className="text-2xl font-bold text-gray-800">2,356</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-white shadow">
              <i className="fas fa-chart-pie" />
            </div>
          </div>


          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Total Posts
              </h5>
              <span className="text-2xl font-bold text-gray-800">924</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-white shadow">
              <i className="fas fa-users" />
            </div>
          </div>


          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Report Count
              </h5>
              <span className="text-2xl font-bold text-gray-800">496</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow">
              <i className="fas fa-percent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
