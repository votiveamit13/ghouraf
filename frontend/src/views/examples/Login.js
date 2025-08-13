
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

const Login = () => {
  return (
    <>
      <Col lg="5" md="7" className="shadow border rounded-lg">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-4">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Login in with</small>
            </div>
            <div className="btn-wrapper text-center d-flex justify-center">
              <Button
                className="btn-neutral btn-icon d-flex w-[35%] justify-center align-center"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-3">
            <div className="text-center text-muted mb-4">
              <small>Or Login in with credentials</small>
            </div>
            <Form role="form">
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
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button className="my-4" color="primary" type="button">
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
