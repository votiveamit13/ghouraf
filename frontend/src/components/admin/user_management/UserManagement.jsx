import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import PaginationComponent from "../../common/Pagination";
import Header from "components/admin/Headers/Header.js";
import SearchFilter from "components/common/SearchFilter";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
      const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const res = await axios.get(`${apiUrl}/admin/users`, {
          headers: { Authorization: `Bearer ${token}`},
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, [token, apiUrl]);

  const handleActionChange = async (mongoId, value) => {
    const status = value === "unblock" ? "active" : "inactive";
    try {
      const res = await axios.patch(`${apiUrl}/admin/users/${mongoId}/status`,
        { status },
        { headers: {Authorization: `Bearer ${token}` }}
      );

      setUsers(prev =>
        prev.map( u => (u._id === mongoId ? res.data.user : u))
      );
          if (status === "inactive") {
      toast.success("User has blocked");
    } else {
      toast.success("User has unblocked");
    }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

const filteredUsers = useMemo(() => {
  return users.filter((user) => {
    const fullName = `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`;
    const email = user.email || "";

    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
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
            <table className="min-w-full text-sm text-gray-700">
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
                  <tr key={user._id}>
                    <td className="px-3 py-3">{startIndex + index + 1}</td>
                    <td className="px-3 py-3"> {user.profile?.firstName} {user.profile?.lastName}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-[60%] ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.status === "active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={user.status === "active" ? "unblock" : "block"}
                        onChange={(e) =>
                          handleActionChange(user._id, e.target.value)
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
