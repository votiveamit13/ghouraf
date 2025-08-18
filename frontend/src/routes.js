import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Icons from "views/examples/Icons.js";
import Login from "views/examples/Login";
import UserManagement from "components/admin/user_management/UserManagement";

export const adminRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-orange",
    component: <Login/>,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    showInSidebar: true
  },
  {
    path: "/user-management",
    name: "User Management",
    icon: "ni ni-bullet-list-67 text-red",
    component: <UserManagement/>,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  }
];


export const publicRoutes = [
  // Will be added in future
];

const routes = [...adminRoutes, ...publicRoutes];
export default routes;
