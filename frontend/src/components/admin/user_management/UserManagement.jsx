import React, { useState, useMemo } from "react";
import PaginationComponent from "../../common/Pagination";
import Header from "components/admin/Headers/Header.js";
import SearchFilter from "components/common/SearchFilter";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", active: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", active: false },
    { id: 3, name: "Mike Brown", email: "mike@example.com", active: true },
    { id: 4, name: "Emily Davis", email: "emily@example.com", active: true },
    { id: 5, name: "Chris Wilson", email: "chris@example.com", active: false },
    { id: 6, name: "Sophia Taylor", email: "sophia@example.com", active: true },
    { id: 7, name: "David Lee", email: "david@example.com", active: false },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleActionChange = (id, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: value === "unblock" } : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              User Management
            </h3>
            <SearchFilter
              placeholder="Search by name or email..."
              onSearch={setSearchTerm}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                  <th className="px-3 py-3 text-left font-semibold">
                    User Name
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Email Id
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-3 py-3">{startIndex + index + 1}</td>
                    <td className="px-3 py-3">{user.name}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-[60%] ${
                          user.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.active ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {user.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={user.active ? "unblock" : "block"}
                        onChange={(e) =>
                          handleActionChange(user.id, e.target.value)
                        }
                        className="block w-32 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="unblock">Unblock</option>
                        <option value="block">Block</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
