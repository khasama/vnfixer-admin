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
import {
  agencySelector,
  categorySelector,
  usersSelector,
} from "@/redux/selectors";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { FaPencilAlt, FaSearch, FaTrashAlt, FaSyncAlt } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../public/css/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import { getAgencies } from "@/redux/reducers/agency";
import { getCategories } from "@/redux/reducers/category";
import { getUsers } from "@/redux/reducers/users";
import { vnfixerAPI } from "@/api/greenBookAPI";

export function Agency() {
  const dispatch = useDispatch();
  const agencies = useSelector(agencySelector);
  const users = useSelector(usersSelector);
  const categories = useSelector(categorySelector);
  const [page, setPage] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [color, setColor] = useState("#980303");
  const [showSelectImg, setShowSelectImg] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [signal, setSignal] = useState(false);
  const [search, setSearch] = useState("");

  // For edit agency
  const [agencyId, setAgencyId] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState("");

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
  }, [signal]);

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

  const handleClear = () => {
    setAgencyId("");
    setName("");
    setDescription("");
  };

  const handleUpdateAgency = async () => {
    if (name?.length > 0 && agencyId > 0 && description?.length > 0) {
      setShowEdit(false);
      try {
        const data = {
          name: name,
          categoryId: categoryId,
          description: description,
        };
        const res = await vnfixerAPI.updateAgency(agencyId, data);
        if (res.status == 200) {
          getAll();
          notify("Đã cập nhật!");
        } else {
          notify("Đã xảy ra lỗi, vui lòng thử lại!");
        }
      } catch (error) {
        console.log(error.message);
      }
      handleClear();
    } else {
      setColor("#980303");
      notify("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleClickUpdateAgency = (
    id,
    name,
    description,
    categoryId,
    ownerId
  ) => {
    setShowEdit(() => {
      setAgencyId(id);
      setName(name);
      setCategoryId(categoryId);
      setCategory(category);
      setDescription(description);
      setOwnerId(ownerId);
      return true;
    });
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

  return (
    <>
      <div className="mt-12 mb-8 flex min-h-[100vh] flex-col gap-12">
        <ToastContainer
          toastStyle={{
            backgroundColor: "#b8fcf6ea",
            color: color,
            marginTop: "10vh",
          }}
        />
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex w-full items-center gap-10 p-6"
          >
            <Typography variant="h5" color="white">
              Đại lý
            </Typography>
            <div className="relative flex w-1/2 items-center  rounded-lg border-b-2 border-[white] py-2 px-4 shadow-md">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
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
            <div className="flex w-full justify-end">
              <Tippy content="Làm mới">
                <span>
                  <Button
                    className="mr-2 rounded-2xl bg-[#0c9dd6] text-white"
                    onClick={() => {
                      setSignal(!signal);
                    }}
                  >
                    <FaSyncAlt></FaSyncAlt>
                  </Button>
                </span>
              </Tippy>
            </div>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên đại lý", "Dịch vụ", "Mô tả", "Sở hữu", "", ""].map(
                    (el, index) => (
                      <th
                        key={index}
                        className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                          el == "Thể loại" ? "hidden lg:block" : ""
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
                {agencies &&
                  agencies.map((agency, key) => {
                    const className = `p-1 xl:py-2 xl:px-4`;

                    return (
                      <tr key={agency.id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={agency?.logo ?? "/img/logo-ct.png"}
                              alt={agency.name}
                              size="sm"
                            />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {agency.name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                |{" "}
                                {agency?.branches?.map(
                                  (branch) => branch.city + " | "
                                )}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {categories &&
                              categories?.find(
                                (category) => category.id == agency?.categoryId
                              )?.name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-2 text-xs font-semibold text-blue-gray-600">
                            {agency?.description}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {users &&
                              users?.find((user) => user.id == agency?.ownerId)
                                ?.email}
                          </Typography>
                        </td>
                        <td
                          className={`${className}`}
                          onClick={() =>
                            handleClickUpdateAgency(
                              agency?.id,
                              agency?.name,
                              agency?.description,
                              agency?.categoryId,
                              agency?.ownerId
                            )
                          }
                        >
                          <Tippy content="Sửa">
                            <span className="flex justify-center">
                              <Typography
                                variant="small"
                                as="p"
                                className="fex items-center justify-center text-xs font-semibold text-blue-gray-600 "
                              >
                                <FaPencilAlt></FaPencilAlt>
                              </Typography>
                            </span>
                          </Tippy>
                        </td>
                        <td
                          className={`${className}`}
                          // onClick={() => alert("")}
                          // onClick={() => handleDeleteBook(book.id)}
                        >
                          <Tippy content="Xoá">
                            <span className="flex justify-center">
                              <Typography
                                variant="small"
                                as="p"
                                className="fex items-center justify-center text-xs font-semibold text-red-400 "
                              >
                                <FaTrashAlt></FaTrashAlt>
                              </Typography>
                            </span>
                          </Tippy>
                        </td>
                      </tr>
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
      {agencies?.length > 0 && showEdit && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <div className=" relative my-6 w-[100vw]">
              <div className="relative mx-auto flex w-4/5 flex-col rounded-lg border-0 bg-[#fffffff8] py-12 px-5 shadow-lg xl:w-4/6">
                <div className="flex w-full flex-row items-center lg:w-4/5">
                  <button
                    className="absolute right-0 top-0 px-2 py-2 text-xl font-bold uppercase text-red-500 lg:px-6"
                    type="button"
                    onClick={() => setShowEdit(false)}
                  >
                    X
                  </button>
                </div>
                <div className="relative max-h-[70vh] flex-auto overflow-auto md:p-4">
                  <div className="mx-auto flex max-w-7xl flex-col items-center rounded-lg p-1 sm:flex-row sm:items-start">
                    <div className="flex w-1/3 items-center justify-center">
                      <Avatar src={"/img/logo-ct.png"} alt={name} size="xxl" />
                    </div>
                    <div className="w-full rounded-2xl p-1 text-sm shadow-md shadow-[#bedcd7e1] sm:w-2/3 lg:p-5">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="flex items-center p-2">
                          <Input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            variant="standard"
                            label="1. Tên đại lý"
                          />
                        </div>
                        <div className="flex items-center p-2">
                          <Input
                            value={
                              users?.find((user) => user.id == ownerId).email
                            }
                            onChange={null}
                            type="text"
                            variant="standard"
                            label="2. Sở hữu"
                          />
                        </div>

                        <div className="flex items-center p-2">
                          <FormControl variant="standard" className="w-10/12">
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              required
                            >
                              3. Dịch vụ
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={categoryId}
                              onChange={(e) => setCategoryId(e.target.value)}
                              label="Dịch vụ"
                            >
                              {categories?.length > 0 &&
                                categories.map((category, index) => {
                                  return (
                                    <MenuItem key={index} value={category.id}>
                                      {category.name}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="flex items-center p-2">
                          <Textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            type="text"
                            variant="standard"
                            label="4. Mô tả"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="pt-9 text-center">
                          <Button
                            type={"submit"}
                            onClick={() => handleUpdateAgency()}
                            className="text-md font-base md:text-md bg-[#0bcaca] p-2 text-white shadow-md shadow-[#5f5e5eb5] hover:shadow-none"
                          >
                            <p>Xác nhận</p>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </>
  );
}

export const MultiSelect = (props) => {
  const [selected, setSelected] = useState(
    props.selected.map((select) => select.name)
  );
  const [selectedIds, setSelectedIds] = useState(
    props.selected.map((select) => select.id)
  );
  useEffect(() => {
    props.onUpdate(() => selectedIds);
  }, [selectedIds]);

  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <InputLabel variant="standard">
        <span className="text-sm">{props.title}</span>
      </InputLabel>
      <Select
        sx={{
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": {
            border: 0,
            borderBottom: "1px solid rgb(176, 190, 197)",
            borderRadius: 0,
            width: "100%",
          },
        }}
        multiple
        variant="standard"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        input={<OutlinedInput label="Multiple Select" />}
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="wrap" variant="standard">
            {selected.map((value, index) => (
              <Chip
                key={value}
                label={value}
                onDelete={() => {
                  setSelected(selected.filter((item) => item !== value)),
                    setSelectedIds(selectedIds.splice(index, 1));
                }}
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      >
        {props.data.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              if (selectedIds.includes(item.id)) {
                setSelectedIds(selectedIds.filter((id) => id !== item.id));
              } else {
                setSelectedIds([...selectedIds, item.id]);
              }
            }}
            value={item.name}
            sx={{ justifyContent: "space-between" }}
          >
            {item.name}
            {JSON.stringify(selected).includes(item.name) ? (
              <CheckIcon color="info" />
            ) : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
