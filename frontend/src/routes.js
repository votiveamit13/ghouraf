import Posts from "pages/admin/post-management/page";
import Users from "pages/admin/user-management/page";
import LoginPage from "pages/admin/login/page";
import AdminDashboard from "pages/admin/page";
// import CreatePost from "pages/admin/post-management/create-post/page";
import { BsPostcard } from "react-icons/bs";
import Edit from "pages/admin/user-management/edit-details/page";
import ViewDetails from "pages/admin/user-management/view-details/page";
// import { IoCreateOutline } from "react-icons/io5";

export const adminRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-[#565ABF]",
    component: <LoginPage/>,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-[#565ABF]",
    component: <AdminDashboard/>,
    layout: "/admin",
    showInSidebar: true
  },
  {
    path: "/user-management",
    name: "User Management",
    icon: "ni ni-bullet-list-67 text-[#565ABF]",
    component: <Users/>,
    layout: "/admin",
  },
  {
    path: "/user-management/edit-details",
    component: <Edit/>,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/user-management/view-details",
    component: <ViewDetails/>,
    layout: "/admin",
    showInSidebar: false
  },
  {
    name: "Post Management",
    icon: "ni ni-single-02 text-[#565ABF]",
    subRoutes: [
      //       {
      //   path: "/post-management/create-post",
      //   name: "Create Post",
      //   icon: <IoCreateOutline className="text-[#565ABF]"/>,
      //   component: <CreatePost/>,
      //   layout: "/admin",
      // },
      {
        path: "/post-management",
        name: "View Posts",
        icon: <BsPostcard className="text-[#565ABF]"/>,
        component: <Posts/>,
        layout: "/admin",
      }
    ]
  },
];


export const publicRoutes = [

];

const routes = [...adminRoutes, ...publicRoutes];
export default routes;
