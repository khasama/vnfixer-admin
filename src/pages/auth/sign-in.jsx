import { login } from "@/redux/reducers/auth";
import { currentUserSelector, isLoggedInSelector } from "@/redux/selectors";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("#980303");
  const [middle, setMiddle] = useState(true);
  const currentUser = useSelector(currentUserSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkError = () => {
      if (isLoggedIn) {
        navigate("/dashboard/home");
      } else if (currentUser.length > 0) {
        setColor("#980303");
        notify(currentUser);
      }
    };
    checkError();
  }, [middle]);

  // alert
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

  const handleLogin = () => {
    if (email.length > 3 && password.length > 3) {
      const user = {
        email: email,
        password: password,
      };
      dispatch(login(user))
        .then(unwrapResult)
        .then(setMiddle(!middle))
        .catch((err) => {
          notify(err.message);
        });
    } else {
      notify(`Vui lòng kiểm tra lại thông tin!`);
    }
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
      <img
        src={"/img/bg.jpg"}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/40" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Đăng nhập
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              type="email"
              label="Email"
              size="lg"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              type="password"
              label="Password"
              size="lg"
              required
            />
            <div className="-ml-2.5 text-xs">
              <Checkbox label="Lưu mật khẩu" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              type="submit"
              onClick={() => handleLogin()}
              variant="gradient"
              fullWidth
            >
              Đăng nhập
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Bạn không có tài khoản?
              <Typography
                as="span"
                variant="small"
                color="blue"
                className="ml-1 font-bold"
              >
                liên hệ người quản trị.
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
