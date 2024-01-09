import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  IconButton,
  Chip as ChipTailwind,
  Select as SelectTalwind,
  Input,
  Textarea,
} from "@material-tailwind/react";
import {
  Stack,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Chip,
  Select,
  FormControl,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import { currentUserSelector, usersSelector } from "@/redux/selectors";
import { useEffect, useRef, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  FaCheckCircle,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { deleteUser, getUsers, updateUserRole } from "@/redux/reducers/users";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Users() {
  const [page, setPage] = useState(1);
  const users = useSelector(usersSelector);
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const [color, setColor] = useState("#980303");
  const listRole = useRef([]);
  const userId = useRef("");

  const getItemProps = (index) => ({
    variant: page === index ? "filled" : "text",
    color: page === index ? "blue" : "blue-gray",
    onClick: () => setPage(index),
  });

  const next = () => {
    if (page === 5) return;

    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;

    setPage(page - 1);
  };

  const handleDeleteUser = async (id) => {
    // try {
    //   await dispatch(deleteUser({ id }));
    //   notify("Đang xoá!");
    //   debouncedUser();
    // } catch (error) {
    //   console.log(error.message);
    //   notify(error.message);
    // }
  };

  const handleUpdateUserRole = () => {
    if (listRole.current.length >= 1 && listRole.current.length < 4) {
      try {
        dispatch(
          updateUserRole({
            id: userId.current,
            listRole: listRole.current,
          })
        ).then(notify("Đã cập nhật!"));
        handleClearOldData();
        debouncedUser();
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setColor("#980303");
      notify("Vui lòng kiểm tra lại số lượng quyền (>=3)!");
    }
  };

  const handleClearOldData = () => {
    userId.current = "";
    listRole.current = [];
  };

  const notify = (content) =>
    toast(`🦄 ${content}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "text-sm font-bold",
      theme: "light",
    });

  const getListUser = () => {
    let row = "20";
    dispatch(getUsers({ limit: row, page: page }))
      .then(unwrapResult)
      .catch((err) => {
        console.log(err);
      });
  };
  const debouncedUser = debounce(getListUser, 1000);
  useEffect(() => {
    getListUser();
  }, [page]);

  const User = (props) => {
    const [listRoleMiddle, setListRoleMiddle] = useState([]);
    const [idMiddle, setIdMiddle] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const handleShowEdit = () => {
      setShowEdit(!showEdit);
    };
    useEffect(() => {
      listRole.current = listRoleMiddle;
      userId.current = idMiddle;
    }, [listRoleMiddle, idMiddle]);

    return (
      <tr key={props.id}>
        <td className={props.className}>
          <div className="flex items-center gap-4">
            <Avatar
              src={props?.image ?? "/img/logo-ct.png"}
              alt={props.name ?? "Default user"}
              size="sm"
            />
            <div className="flex flex-col items-start">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold"
              >
                {props.email}
              </Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="text-xs font-semibold text-blue-gray-600"
              >
                {props.role}
              </Typography>
            </div>
          </div>
        </td>
        <td className={props.className}>
          <Typography
            variant="small"
            className="text-xs font-semibold text-blue-gray-900"
          >
            {props.fullName ?? "Default user"}
          </Typography>
        </td>
        <td className={`${props.className} hidden lg:table-cell`}>
          <div className="flex flex-col items-start gap-2">
            <Typography
              variant="small"
              className="text-xs font-semibold text-blue-gray-900"
            >
              {props.address ?? "23 võ văn đặng, đà nẵng"}
            </Typography>
            <Typography
              variant="small"
              className="text-xs font-semibold text-blue-gray-600"
            >
              {props.phone ?? "03825980"}
            </Typography>
          </div>
        </td>
        <td className={props.className}>
          <ChipTailwind
            variant="gradient"
            // color={
            //   props.is_verified && JSON.stringify(props.is_verified) == "true"
            //     ? "green"
            //     : "red"
            // }
            value={props.agencyRole}
            className="py-0.5 px-2 text-[11px] font-medium"
          />
        </td>
        <td
          className={props.className}
          onClick={() => handleDeleteUser(props.id)}
        >
          <Tippy content="Xoá">
            <span>
              <Typography
                variant="small"
                as="p"
                className="flex items-center justify-center text-xs font-semibold text-red-400"
              >
                <FaTrashAlt></FaTrashAlt>
              </Typography>
            </span>
          </Tippy>
        </td>
      </tr>
    );
  };

  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: "#b8fcf6ea",
          color: color,
          marginTop: "10vh",
        }}
      />
      <div className="mt-12 mb-8 flex min-h-[100vh] flex-col gap-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex w-full items-center gap-10 p-6"
          >
            <Typography variant="h5" color="white">
              Người dùng
            </Typography>
            <div className="relative flex w-1/2 items-center  rounded-lg border-b-2 border-[white] py-2 px-4 shadow-md">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className=" w-3/4 bg-transparent px-2 text-base font-normal text-white"
                name="search"
                id="search"
              />
              <div className="absolute right-0 flex h-full items-center rounded-r-lg py-2 px-3">
                <FaSearch className="text-[white]"></FaSearch>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Email", "Tên", "Liên hệ", "Vai trò đại lý", "", ""].map(
                    (el, index) => (
                      <th
                        key={index}
                        className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                          el == "Ngày tạo" ? "hidden lg:block" : ""
                        }`}
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user, key) => {
                    const className = `p-1 xl:py-2 xl:px-4 my-auto ${
                      key === users.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <User
                        key={user.id}
                        id={user.id}
                        className={className}
                        image={user?.imageUrl}
                        email={user?.email}
                        phone={user?.phone}
                        fullName={user?.fullName}
                        address={user?.address}
                        role={user?.role}
                        agencyRole={user?.agencyRole}
                      ></User>
                    );
                  })}
              </tbody>
            </table>
          </CardBody>
          <div className="flex items-center justify-end  gap-4">
            <Button
              variant="text"
              color="blue-gray"
              className="flex items-center gap-2"
              onClick={prev}
              disabled={page === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <IconButton {...getItemProps(1)}>1</IconButton>
              <IconButton {...getItemProps(2)}>2</IconButton>
              <IconButton {...getItemProps(3)}>3</IconButton>
              <IconButton {...getItemProps(4)}>4</IconButton>
              <IconButton {...getItemProps(5)}>5</IconButton>
            </div>
            <Button
              variant="text"
              color="blue-gray"
              className="flex items-center gap-2"
              onClick={next}
              disabled={page === 5}
            >
              Next
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Users;
