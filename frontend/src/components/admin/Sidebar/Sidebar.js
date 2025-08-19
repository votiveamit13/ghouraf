import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);


  const toggleCollapse = () => setCollapseOpen((data) => !data);
  const closeCollapse = () => setCollapseOpen(false);

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const createLinks = (routes) => {
    return routes
      .filter((route) => route.showInSidebar !== false)
      .map((prop, key) => {
        if (prop.subRoutes) {

          const isOpen = openSubmenu === prop.name;
          return (
            <div key={key} className="w-100">
              <NavItem>
<div
  className="d-flex align-items-center nav-link"
  style={{ cursor: "pointer" }}
  onClick={() => toggleSubmenu(prop.name)}
>
  <span className="me-2">
    {typeof prop.icon === "string" ? <i className={prop.icon} /> : prop.icon}
  </span>
  {prop.name}
<span className="ml-2">
  {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
</span>
</div>

              </NavItem>
              <Collapse isOpen={isOpen} >
                {prop.subRoutes.map((sub, subKey) => (
                  <NavItem key={subKey}>
                    <NavLink
                      to={sub.layout + sub.path}
                      tag={NavLinkRRD}
                      className={({ isActive }) =>
                        isActive ? "active nav-link" : "nav-link"
                      }
                      onClick={closeCollapse}
                    >
                      <span className="me-2">
                        {typeof sub.icon === "string" ? <i className={sub.icon} /> : sub.icon}
                      </span>
                      {sub.name}
                    </NavLink>
                  </NavItem>
                ))}

              </Collapse>
            </div>
          );
        }

        // Normal single route
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              end={prop.path === ""}   // 👈 only Dashboard uses exact match
              tag={NavLinkRRD}
              className={({ isActive }) =>
                isActive ? "active nav-link" : "nav-link"
              }
              onClick={closeCollapse}
            >
              <span className="me-2">
                {typeof prop.icon === "string" ? <i className={prop.icon} /> : prop.icon}
              </span>
              {prop.name}
            </NavLink>

          </NavItem>
        );
      });
  };

  const { routes, logo } = props;

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {logo ? (
          <NavbarBrand className="pt-0">
            <img
              className="navbar-brand-img"
              alt={logo.imgAlt}
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>{createLinks(routes)}</Nav>
          <hr className="my-3" />
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
