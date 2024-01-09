import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { categorySelector } from "@/redux/selectors";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { FaPencilAlt, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import {
  // createGenre,
  // deleteGenre,
  getCategories,
  // getGenres,
  // updateGenre,
} from "@/redux/reducers/category";
import Tippy from "@tippyjs/react";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vnfixerAPI } from "@/api/greenBookAPI";
import { getAgencies } from "@/redux/reducers/agency";
import { getUsers } from "@/redux/reducers/users";

export function Service() {
  const [page, setPage] = useState(1);
  const categories = useSelector(categorySelector);
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const [color, setColor] = useState("#980303");

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");

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

  const handleShowUpdate = () => {
    setShowCreate(!showCreate);
  };
  const handleClear = () => {
    setId(() => {
      setServiceName("");
      setDescription("");
      return "";
    });
  };

  const formatTextKey = (input) => {
    const unaccentedString = input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const stringWithoutSpaces = unaccentedString.replace(/\s+/g, "");
    return stringWithoutSpaces;
  };

  const handleCreateServices = async () => {
    if (serviceName.length > 0 && description.length > 0) {
      try {
        const data = {
          name: serviceName,
          description: description,
          key: `category.${formatTextKey(serviceName)}`,
        };
        const res = await vnfixerAPI.createCategory(data);
        if (res.status == 200) {
          getAll();
          notify("Đã tạo!");
        } else {
          notify("Đã xảy ra lỗi, vui lòng thử lại!");
        }
        setShowCreate(false);
      } catch (error) {
        console.log(error.message);
      }
      handleClear();
    } else {
      setColor("#980303");
      notify("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleUpdateServices = async () => {
    if (serviceName.length > 0 && description.length > 0) {
      setShowCreate(false);
      try {
        const data = {
          name: serviceName,
          description: description,
        };
        const res = await vnfixerAPI.updateCategory(id, data);
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

  const handleClickUpdateService = (name, description, id) => {
    setServiceName(() => {
      setDescription(description);
      setId(id);
      return name;
    });
  };

  // const handleUpdateGenre = () => {
  //   const debouncedGenreUpdate = debounce(getListGenre, 1000);
  //   if (name.length > 1 && genreId) {
  //     try {
  //       setShowCreate(false);
  //       dispatch(
  //         updateGenre({
  //           id: genreId,
  //           name: name,
  //           description: "",
  //         })
  //       );
  //       notify("Đã cập nhật!");
  //       handleClearOldData();
  //       debouncedGenreUpdate();
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   } else {
  //     setColor("#980303");
  //     notify("Vui lòng kiểm tra lại!");
  //   }
  // };

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

  // const getListGenre = () => {
  //   let row = "20";
  //   dispatch(getGenres({ limit: row, page: page }))
  //     .then(unwrapResult)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
              Dịch vụ
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
            <div className="flex w-full justify-end">
              <Tippy content="Tạo mới">
                <span>
                  <Button
                    className="mr-2 rounded-2xl bg-[#0c9dd6] text-white"
                    onClick={() => handleShowUpdate()}
                  >
                    <FaPlus></FaPlus>
                  </Button>
                </span>
              </Tippy>
            </div>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên dịch vụ", "Mô tả", "", ""].map((el, index) => (
                    <th
                      key={index}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories &&
                  categories.map((category, key) => {
                    const className = `py-3 px-5 ${
                      key === categories.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={category.id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {category.name}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {category?.description ?? ""}
                          </Typography>
                        </td>

                        <td
                          className={className}
                          onClick={() => {
                            handleShowUpdate(),
                              handleClickUpdateService(
                                category?.name ?? "",
                                category?.description ?? "",
                                category?.id ?? ""
                              );
                          }}
                        >
                          <Tippy content="Sửa">
                            <span>
                              <Typography
                                variant="small"
                                as="p"
                                className="flex items-center justify-center text-xs font-semibold text-blue-gray-600"
                              >
                                <FaPencilAlt></FaPencilAlt>
                              </Typography>
                            </span>
                          </Tippy>
                        </td>
                        <td
                          className={className}
                          onClick={() => alert("")}
                          // onClick={() => handleDeleteGenre(category.id)}
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
      {categories && showCreate && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <div className=" relative my-6 w-[70vw]">
              <div className="relative mx-auto flex w-4/5 flex-col rounded-lg border-0 bg-[#fffffff8] py-12 px-5 shadow-lg xl:w-4/6">
                <div className="flex w-full flex-row items-center lg:w-4/5">
                  <button
                    className="absolute right-0 top-0 px-2 py-2 text-xl font-bold uppercase text-red-500 lg:px-6"
                    type="button"
                    onClick={handleShowUpdate}
                  >
                    X
                  </button>
                </div>
                <div className="relative max-h-[70vh] flex-auto overflow-auto md:p-4">
                  <div className="mx-auto flex max-w-2xl flex-col items-center rounded-lg p-1 sm:flex-row sm:items-start">
                    <div
                      className={`w-full rounded-2xl p-1 text-sm shadow-md shadow-[#bedcd7e1] lg:p-5`}
                    >
                      <div className="flex w-full flex-col items-center justify-center gap-5">
                        <div className=" flex w-full items-center p-2">
                          <Input
                            onChange={(e) => setServiceName(e.target.value)}
                            value={serviceName}
                            type="text"
                            variant="standard"
                            label="Tên dịch vụ"
                          />
                        </div>
                        <div className="flex w-full items-center p-2">
                          <Input
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            type="text"
                            variant="standard"
                            label="Mô tả"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="pt-9 text-center">
                          <Button
                            type={"submit"}
                            onClick={() =>
                              id
                                ? handleUpdateServices()
                                : handleCreateServices()
                            }
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
