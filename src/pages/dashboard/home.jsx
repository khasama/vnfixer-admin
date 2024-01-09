import React, { useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsCardsData, statisticsChartsData } from "@/data";
import { useDispatch, useSelector } from "react-redux";
import { getAgencies } from "@/redux/reducers/agency";
import { unwrapResult } from "@reduxjs/toolkit";
import { getCategories } from "@/redux/reducers/category";
import { getUsers } from "@/redux/reducers/users";
import {
  agencySelector,
  categorySelector,
  usersSelector,
} from "@/redux/selectors";

export function Home() {
  const dispatch = useDispatch();

  const getAll = () => {
    dispatch(getAgencies())
      .then(unwrapResult)
      .catch((err) => {
        alert(err.message);
      });
    dispatch(getCategories())
      .then(unwrapResult)
      .catch((err) => {
        alert(err.message);
      });
    dispatch(getUsers())
      .then(unwrapResult)
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData().map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
