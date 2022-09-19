import styles from "./Topbar.module.css"
import { useState, useEffect } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import cookie from 'js-cookie';
import { useSession, signOut } from "next-auth/react";
import Login from "components/Login/Login";

export default function Topbar() {
  const { data: session } = useSession();
  const [user, setUser] = useState(session && session.user);
  const [anchorEl, setAnchorEl] = useState(null);

  console.log("session: ", session);

  const router = useRouter();
  // if (!session) router.push("/login");
  if (!session) {
    return (
      <div>
        <Login />
      </div>);
  }



  const handleLogout = () => {
    signOut();
    // console.log("logout");
    // cookie.remove('token');
    // cookie.remove('user');
    router.push("/login");
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  // useEffect(() => {
  // const userData = cookie.get("user");
  //   userData ? setUser(JSON.parse(userData)) : router.push("/login");

  // }, []);



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
              {user?.email}
            </div>
            <div className={styles.topAvatarContainer}>
              {user?.image ? <Image height={50} width={50} src={`${process.env.NEXT_PUBLIC_thumbURL}/users/${session?.user.image}`} className={styles.topAvatar} />
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
        <MenuItem onClick={handleClose} style={{ textTransform: "capitalize" }}>Admin</MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Logout</MenuItem>
      </Menu>
    </div >
  );
}
