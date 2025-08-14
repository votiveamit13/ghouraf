import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Badge,
} from "reactstrap";
import PaginationComponent from "../../common/Pagination";
import Header from "components/admin/Headers/Header.js";

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(users.length / pageSize);

  const handleActionChange = (id, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: value === "unblock" } : user
      )
    );
  };

  // slice users for current page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">User Management</h3>
              </CardHeader>

              {/* Table */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">S. No.</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Email Id</th>
                    <th scope="col">Active</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge
                          color=""
                          className="badge-dot"
                          style={{ cursor: "default" }}
                        >
                          <i
                            className={user.active ? "bg-success" : "bg-danger"}
                          />
                          {user.active ? "Active" : "Blocked"}
                        </Badge>
                      </td>
                      <td>
                        <select
                          value={user.active ? "unblock" : "block"}
                          onChange={(e) =>
                            handleActionChange(user.id, e.target.value)
                          }
                          className="form-control form-control-sm"
                        >
                          <option value="unblock">Unblock</option>
                          <option value="block">Block</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <CardFooter className="py-4">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default UserManagement;
