import styles from "./Topbar.module.css"
import { useState, useEffect } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Topbar() {
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
    setUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    console.log("logout");
    router.push("/login");
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
        <div className={`${styles.topLeft} cursor-pointer`}>
          <Link href="/" >
            <Typography component="h1" variant="h4" align="center" gutterBottom style={{ marginBottom: '0' }}>
              Ashley Furniture
            </Typography>
          </Link>
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

