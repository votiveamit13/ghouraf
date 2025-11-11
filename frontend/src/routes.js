import Users from "pages/admin/user-management/page";
import LoginPage from "pages/admin/login/page";
import AdminDashboard from "pages/admin/page";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import Edit from "pages/admin/user-management/edit-details/page";
import ViewDetails from "pages/admin/user-management/view-details/page";
import ContactForm from "pages/admin/contact-form/page";
import { MdContactMail, MdOutlineBedroomParent, MdOutlineHomeWork, MdOutlinePolicy, MdPolicy } from "react-icons/md";
import FaqManagement from "pages/admin/faq-management/page";
import { FaImages, FaQuestion, FaQuora, FaRegCircleUser } from "react-icons/fa6";
import AddFaq from "components/admin/faq-management/AddFaq";
import EditFaq from "components/admin/faq-management/EditFaq";
import Spaces from "components/admin/post_management/Spaces";
import TeamUps from "components/admin/post_management/TeamUps";
import { AiFillDashboard } from "react-icons/ai";
import { FaMailBulk, FaUserCog } from "react-icons/fa";
import { RiAdvertisementFill, RiAdvertisementLine, RiTeamLine } from "react-icons/ri";
import SpaceWanted from "components/admin/post_management/SpaceWanted";
import HeroImage from "pages/admin/home-screen-image/page";
import { CiImageOn } from "react-icons/ci";
import PolicyManagement from "pages/admin/policy-management/page";
import AddPolicy from "components/admin/policy-management/AddPolicy";
import EditPolicy from "components/admin/policy-management/EditPolicy";
import ReportList from "pages/admin/post-management/reports/page";
import { GoReport } from "react-icons/go";
import AdManagement from "pages/admin/ad-management/page";
import CreateAd from "components/admin/ad-managmenet/CreateAd";
import EditAd from "components/admin/ad-managmenet/EditAd";
import Newsletter from "pages/admin/newsletter-management/page";
import ViewProfile from "components/admin/profile-management/ViewProfile";
import EditProfile from "components/admin/profile-management/EditProfile";

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
    path: "/profile",
    name: "My Profile",
    icon: "ni ni-key-25 text-[#565ABF]",
    component: <ViewProfile />,
    layout: "/admin",
    showInSidebar: false
  },
    {
    path: "/edit-profile",
    name: "Edit My Profile",
    icon: "ni ni-key-25 text-[#565ABF]",
    component: <EditProfile />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "",
    name: "Dashboard",
    icon: <AiFillDashboard size={20} className="text-[#565ABF]" />,
    component: <AdminDashboard />,
    layout: "/admin",
    showInSidebar: true
  },
  {

    name: "User Management",
    icon: <FaUserCog size={20} className="text-[#565ABF]" />,
    subRoutes: [
      {
        path: "/user-management",
        name: "Users List",
        icon: <FaRegCircleUser className="text-[#565ABF]" />,
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
    icon: <BsFillFileEarmarkPostFill size={20} className="text-[#565ABF]" />,
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
        icon: <MdOutlineBedroomParent className="text-[#565ABF]" />,
        component: <Spaces />,
        layout: "/admin",
      },
      {
        path: "/post-management/sapce-wanted",
        name: "Space Wanted",
        icon: <MdOutlineHomeWork className="text-[#565ABF]" />,
        component: <SpaceWanted />,
        layout: "/admin",
      },
      {
        path: "/post-management/team-ups",
        name: "Team Ups",
        icon: <RiTeamLine className="text-[#565ABF]" />,
        component: <TeamUps />,
        layout: "/admin",
      },
      {
        path: "/post-management/reports",
        name: "Report List",
        icon: <GoReport  className="text-[#565ABF]"/>,
        component: <ReportList/>,
        layout: "/admin",
      }
    ]
  },
    {
    name: "Ad Management",
    icon: <RiAdvertisementFill size={20} className="text-[#565ABF]" />,
    subRoutes: [
      {
        path: "/ad-management",
        name: "Ad List",
        icon: <RiAdvertisementLine className="text-[#565ABF]" />,
        component: <AdManagement />,
        layout: "/admin",
      },
    ]
  },
  {
    path: "/ad-management/add",
    component: <CreateAd />,
    layout: "/admin",
    showInSidebar: false
  },
    {
    path: "/ad-management/edit",
    component: <EditAd />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    name: "FAQ Management",
    icon: <FaQuora size={20} className="text-[#565ABF]" />,
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
    component: <EditFaq />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    name: "Policy Management",
    icon: <MdPolicy size={20} className="text-[#565ABF]" />,
    subRoutes: [
      {
        path: "/policy-management",
        name: "Policies List",
        icon: <MdOutlinePolicy className="text-[#565ABF]" />,
        component: <PolicyManagement />,
        layout: "/admin",
      },
    ]
  },
    {
    path: "/policy-management/add",
    component: <AddPolicy />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/policy-management/edit",
    component: <EditPolicy />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/contact-forms",
    name: "Contact Forms",
    icon: <MdContactMail size={20} className="text-[#565ABF]" />,
    component: <ContactForm />,
    layout: "/admin",
  },
    {
    name: "Home Screen Image Management",
    icon: <FaImages size={20} className="text-[#565ABF]" />,
    subRoutes: [
      {
        path: "/homescreen-image",
        name: "Banner Image",
        icon: <CiImageOn className="text-[#565ABF]" />,
        component: <HeroImage />,
        layout: "/admin",
      },
    ]
  },
    {
    path: "/newsletter",
    name: "Newsletter",
    icon: <FaMailBulk size={20} className="text-[#565ABF]" />,
    component: <Newsletter />,
    layout: "/admin",
  },
];


const routes = [...adminRoutes];
export default routes;
