import { FaBuilding, FaLocationDot, FaToolbox, FaUsers } from "react-icons/fa6";
import {
  agencySelector,
  categorySelector,
  usersSelector,
} from "@/redux/selectors";
import { useSelector } from "react-redux";

export const statisticsCardsData = () => {
  const categories = useSelector(categorySelector);
  const agencies = useSelector(agencySelector);
  const users = useSelector(usersSelector);

  const calculateTotalBranches = (agencies) => {
    return agencies?.reduce((total, agency) => {
      return total + agency?.branches?.length;
    }, 0);
  };

  let agenciesLength = agencies?.length;
  let categoriesLength = categories?.length;
  let usersLength = users?.length;
  let totalBranches = calculateTotalBranches(agencies);

  return [
    {
      color: "blue",
      icon: FaBuilding,
      title: "Đại lý",
      value: agenciesLength,
      footer: {
        color: "text-green-500",
        value: "+7%",
        label: "so với tháng trước",
      },
    },
    {
      color: "pink",
      icon: FaLocationDot,
      title: "Chi nhánh",
      value: totalBranches,
      footer: {
        color: "text-green-500",
        value: "+12%",
        label: "so với tháng trước",
      },
    },
    {
      color: "green",
      icon: FaToolbox,
      title: "Dịch vụ",
      value: categoriesLength,
      footer: {
        color: "text-green-500",
        value: "+2%",
        label: "so với tháng trước",
      },
    },
    {
      color: "orange",
      icon: FaUsers,
      title: "Người dùng",
      value: usersLength,
      footer: {
        color: "text-green-500",
        value: "+8%",
        label: "so với tháng trước",
      },
    },
  ];
};

export default statisticsCardsData;
