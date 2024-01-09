import {
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Agency, Home, Service, Users } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { FaBuilding, FaToolbox } from "react-icons/fa6";

const icon = {
  className: "w-5 h-5 text-inherit",
};

let routes;

const routesDistribute = () => {
  routes = null;

  return [
    {
      layout: "dashboard",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "Thống kê",
          path: "/home",
          element: <Home />,
        },
        {
          icon: <FaToolbox {...icon} />,
          name: "Dịch vụ",
          path: "/service",
          element: <Service />,
        },
        {
          icon: <FaBuilding {...icon} />,
          name: "Đại lý",
          path: "/agency",
          element: <Agency />,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "Người dùng",
          path: "/users",
          element: <Users />,
        },
      ],
    },
    {
      title: "auth pages",
      layout: "auth",
      pages: [
        {
          icon: <ArrowRightOnRectangleIcon {...icon} />,
          name: "Đăng xuất",
          path: "/sign-in",
          element: <SignIn />,
        },
      ],
    },
  ];
};

export const assignRoutes = () => {
  routes = routesDistribute();
  return routes;
};

assignRoutes();

export default routes;
