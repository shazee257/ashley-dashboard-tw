import styles from "./Sidebar.module.css";
import {
  ExitToAppRounded,
  SupervisorAccountOutlined,
  SettingsOutlined,
  HelpOutlineOutlined,
  TrackChangesOutlined,
  BusinessCenterOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from "@mui/icons-material";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState } from 'react';

export default function Sidebar() {
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isClicked4, setIsClicked4] = useState(false);
  const [isProduct, setIsProduct] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  }

  const handleClickMenu1 = () => setIsClicked1(!isClicked1);
  const handleClickMenu2 = () => setIsClicked2(!isClicked2);
  const handleClickMenu3 = () => setIsClicked3(!isClicked3);
  const handleClickMenu4 = () => setIsClicked4(!isClicked4);
  const handleProductClick = () => setIsProduct(!isProduct);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper} style={{ width: '220px' }}>

        {/* E-commerce */}
        {/* <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu1} >
            <div className={styles.MenuLeftItems}>
              <BusinessCenterOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>e-Commerce</h3>
            </div>
            {isClicked1 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked1}>

            <li className={`${styles.li} ${RegExp(/products/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/products' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Products</a>
              </Link>
            </li>

          </ul>
        </div> */}

        {/* Products Categories Stores/Warehouses Brands */}
        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleProductClick} >
            <div className={styles.MenuLeftItems}>
              <SupervisorAccountOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Products</h3>
            </div>
            {isProduct ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isProduct}>

            <li className={`${styles.li} ${RegExp(/products/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/products' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>All Products</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/categories/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/categories' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Categories</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/stores/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/stores' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Warehouses/Stores</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/brands/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/brands' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Brands</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/attributes/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/attributes' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Attributes</a>
              </Link>
            </li>

          </ul>
        </div>

        {/* Users Management */}
        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu2} >
            <div className={styles.MenuLeftItems}>
              <SupervisorAccountOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Users Management</h3>
            </div>
            {isClicked2 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked2}>

            <li className={`${styles.li} ${RegExp(/users\/admin/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/admin' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Admin</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/users\/store/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/store' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Store Users</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/users\/cutomers/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/customers' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Customers</a>
              </Link>
            </li>


          </ul>
        </div>

        {/* CMS */}
        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu3} >
            <div className={styles.MenuLeftItems}>
              <TrackChangesOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Content Mgmt Sys</h3>
            </div>
            {isClicked3 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked3}>

            <li className={`${styles.li} ${RegExp(/banners/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/banners' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Banners</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/colors/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/colors' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Product Colors</a>
              </Link>
            </li>




          </ul>
        </div>

        {/* Settings */}
        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu4} >
            <div className={styles.MenuLeftItems}>
              <SettingsOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Settings</h3>
            </div>
            {isClicked4 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked4}>

            <li className={`${styles.li} ${router.pathname == "/settings" ? styles.active : ""}`}>
              <Link href='/' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>
                  Settings</a>
              </Link>
            </li>

            <li className={`${styles.li} ${router.pathname == "/login" ? styles.active : ""}`} onClick={handleLogout} >
              <Link href='/login' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}><ExitToAppRounded className={styles.sidebarIcon} />Logout</a>
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </div >
  );
}



//   const sidebarItems = [
//     {
//       title: "Dashboard",
//       icon: <SupervisorAccountOutlined />,
//       link: "/",
//     },
//     {
//       title: "Users",
//       icon: <SupervisorAccountOutlined />,
//       link: "/users",
//     },
//     {
//       title: "All Products",
//       icon: <TrackChangesOutlined />,
//       link: "/products",
//       subItems: [
//         {
//           title: "Create Product",
//           icon: <BusinessCenterOutlined />,
//           link: "/products/create",
//         },
//         {
//           title: "Categories",
//           icon: <BusinessCenterOutlined />,
//           link: "/categories",
//         },
//         {
//           title: "Attributes",
//           icon: <BusinessCenterOutlined />,
//           link: "/attributes",
//         },
//       ],
//     },

//     {
//       title: "Brands",
//       icon: <BusinessCenterOutlined />,
//       link: "/brands",
//     },
//     {
//       title: "Settings",
//       icon: <SettingsOutlined />,
//       link: "/settings",
//     },
//     {
//       title: "Support",
//       icon: <HelpOutlineOutlined />,
//       link: "/support",
//     },
//   ];

//   const [sidebar, setSidebar] = useState(false);
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     router.push("/login");
//   };

//   return (
//     <div className={styles.sidebar}>
//       <div className={styles.sidebarWrapper}>
//         <div className={styles.sidebarMenu}>
//           {sidebarItems.map((item, index) => (
//             <div key={index}>
//               <div className="flex items-center text-sm m-0 text-slate-500">
//                 {item.icon}
//                 <span className="ml-2">{item.title}</span>
//               </div>
//               {item.subItems && (
//                 <div className="ml-4">
//                   {item.subItems.map((subItem, index) => (
//                     <div key={index}>
//                       <Link href={subItem.link}>
//                         <a className="flex items-center text-sm m-0 text-slate-500 cursor-pointer ">
//                           {subItem.icon}
//                           <span className="ml-2">{subItem.title}</span>
//                         </a>
//                       </Link>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         <div className={styles.sidebarLogout} onClick={handleLogout}>
//           <ExitToAppRounded />
//           <span>Logout</span>
//         </div>
//       </div>
//     </div>
//   );
// }