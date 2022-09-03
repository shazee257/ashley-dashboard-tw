import styles from "./Topbar.module.css"
import { useState, useEffect } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import cookie from 'js-cookie';

export default function Topbar({ user }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    cookie.remove('token');
    router.push("/login");
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.topbar}>
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
            <div className={styles.userRole}>
              {`${user?.first_name} ${user?.last_name}`}
            </div>
            <div className={styles.topAvatarContainer}>
              {user?.image ? <Image height={50} width={50} src={`${process.env.NEXT_PUBLIC_thumbURL}/users/${user.image}`} className={styles.topAvatar} />
                : <Image height={50} width={50} src={`${process.env.NEXT_PUBLIC_thumbURL}/users/avatar.png`} className={styles.topAvatar} />
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
        <MenuItem onClick={handleClose}>{user?.email}</MenuItem>
        <MenuItem onClick={handleClose} style={{ textTransform: "capitalize" }}>{user?.role}</MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Logout</MenuItem>
      </Menu>
    </div >
  );
}
