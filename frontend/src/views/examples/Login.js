
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/admin/index");
        toast.success("Login Successful")
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.log("error:", err)
    }
  };
  return (
    <>
      <Col className="mt-[100px] text-center align-center d-flex justify-center w-full h-auto">
        <Card className="bg-secondary shadow border-0 w-[400px]">
          <CardHeader className="bg-transparent pb-4">
            <div className="text-mutedmt-2">
              <div className="mt-3">
                <img
                  src={require("../../assets/img/theme/Ghouraf.png")}
                  alt="Logo"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <large className="font-semibold text-m">Welcome Back! Login to Continue</large>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-3">
            <Form role="form" onSubmit={handleSubmit}>
              {error && <div className="text-danger mb-3">{error}</div>}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
                    <Row>
          <Col xs="12" className="text-center">
            <a
              className="text-light text-center"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small className="text-muted">Forgot password?</small>
            </a>
          </Col>
          {/* <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="./register"
            >
              <small className="text-muted">Create new account</small>
            </a>
          </Col> */}
        </Row>
          </CardBody>
        </Card>

      </Col>
    </>
  );
};

export default Login;
