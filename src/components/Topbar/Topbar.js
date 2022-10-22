import styles from "./Topbar.module.css"
import { useState, useEffect } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

export default function Topbar() {
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const { push } = useRouter();

  useEffect(() => {
    localStorage.getItem("user") && setUser(JSON.parse(localStorage.getItem("user")));
    // let token = document.cookie.split("=")[1]
    // console.log(document.cookie.split("=")[1]);
  }, []);

  const handleLogout = () => {
    axios.post(`${process.env.NEXT_PUBLIC_baseURL}/users/logout`, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.status === 200) {
          toast.success(data.message);
          localStorage.removeItem("user");
          setUser({});
          push("/login");
        }
      }).catch(err => console.log("err: ", err));
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={`z-10 mb-5 w-full h-20 text-white sticky top-0 bg-blue-800`}>
      <div className={styles.topbarWrapper}>
        <div className={styles.topLeft}>
          <Typography component="h1" variant="h4" align="center" gutterBottom style={{ marginBottom: '0' }}>
            Ashley Furniture
          </Typography>
        </div>
        <div className={styles.topCenter}>
          <Typography component="h1" variant="h4" gutterBottom style={{ marginBottom: '0' }} >
            Admin Dashboard
          </Typography>
        </div>
        <div className={styles.topRight}>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <div className="text-white lowercase mr-2">
              {user.email}
            </div>
            <div className={styles.topAvatarContainer}>
              {user.image && <Image className="-z-10" alt="pic" layout="fixed" height={40} width={40} src={`${process.env.NEXT_PUBLIC_thumbURL}/users/${user.image}`} />
                // : <Image alt="pic" height={50} width={50} src={`${process.env.NEXT_PUBLIC_thumbURL}/users/avatar.png`} className={styles.topAvatar} />
              }
            </div>
          </Button>
        </div>
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>{user.email}</MenuItem>
        <MenuItem onClick={handleClose} style={{ textTransform: "capitalize" }}>{user.role}</MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Logout</MenuItem>
      </Menu>
    </div >
  );
}

