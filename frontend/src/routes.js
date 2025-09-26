import Users from "pages/admin/user-management/page";
import LoginPage from "pages/admin/login/page";
import AdminDashboard from "pages/admin/page";
import { BsPostcard } from "react-icons/bs";
import Edit from "pages/admin/user-management/edit-details/page";
import ViewDetails from "pages/admin/user-management/view-details/page";
import ContactForm from "pages/admin/contact-form/page";
import { MdOutlineContactMail } from "react-icons/md";
import FaqManagement from "pages/admin/faq-management/page";
import { FaQuestion } from "react-icons/fa6";
import AddFaq from "components/admin/faq-management/AddFaq";
import EditFaq from "components/admin/faq-management/EditFaq";
import Spaces from "components/admin/post_management/Spaces";

export const adminRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-[#565ABF]",
    component: <LoginPage />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-[#565ABF]",
    component: <AdminDashboard />,
    layout: "/admin",
    showInSidebar: true
  },
  {

    name: "User Management",
    icon: "ni ni-bullet-list-67 text-[#565ABF]",
    subRoutes: [
      {
        path: "/user-management",
        name: "Users List",
        icon: "ni ni-bullet-list-67 text-[#565ABF]",
        component: <Users />,
        layout: "/admin",
      },
    ]
  },
  {
    path: "/user-management/edit-details",
    component: <Edit />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/user-management/view-details",
    component: <ViewDetails />,
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
        path: "/post-management/spaces",
        name: "Spaces",
        icon: <BsPostcard className="text-[#565ABF]" />,
        component: <Spaces />,
        layout: "/admin",
      }
    ]
  },
  {

    name: "FAQ Management",
    icon: <FaQuestion className="text-[#565ABF]" />,
    subRoutes: [
      {
        path: "/faq-management",
        name: "FAQ List",
        icon: <FaQuestion className="text-[#565ABF]" />,
        component: <FaqManagement />,
        layout: "/admin",
      },
    ]
  },
  {
    path: "/faq-management/add",
    component: <AddFaq />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/faq-management/edit",
    component: <EditFaq/>,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/contact-forms",
    name: "Contact Forms",
    icon: <MdOutlineContactMail className="text-[#565ABF]" />,
    component: <ContactForm />,
    layout: "/admin",
  }
];


const routes = [...adminRoutes];
export default routes;
