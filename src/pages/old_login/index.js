import Login from "components/Login/Login";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
    if (user) {
      router.push("/");
    }
  }, [])

  return (
    <div>
      <Login />
    </div>
  )
}
