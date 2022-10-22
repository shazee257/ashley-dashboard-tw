import { useRef, useEffect } from "react";
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@mui/material';
import { LockOpenOutlined } from '@mui/icons-material';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import axios from "axios";
// import 'react-toastify/dist/ReactToastify.css';
// import { signIn } from "next-auth/react";

export default function Login() {
    const { push } = useRouter();

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_baseURL}/users/login`,
                user, { withCredentials: true }
            )
            .then(({ data }) => {
                if (data.status === 200) {
                    localStorage.setItem("user", JSON.stringify(data.authData));
                    toast.success(data.message);
                    push("/order");
                } else {
                    toast.error(data.message);
                }
            }).catch(err => {
                console.log("err: ", err);
            })
    };

    const paperStyle = { padding: 20, width: 280, margin: "200px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }


    return (
        <>
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <form onSubmit={handleSubmit}>
                        <Grid align='center' className="mb-10">
                            <Avatar style={avatarStyle}><LockOpenOutlined /></Avatar>
                            <h2>Sign In</h2>
                        </Grid>

                        <TextField
                            label='Email'
                            placeholder='Enter Email'
                            fullWidth
                            inputRef={emailRef}
                        />
                        <br /><br />
                        <TextField
                            label='Password'
                            placeholder='Enter password'
                            type='password'
                            fullWidth
                            inputRef={passwordRef}
                        />
                        <br /><br />
                        <Button type="submit" color='primary' variant="outlined" style={btnstyle} fullWidth >Sign in</Button>
                    </form>
                    <Typography >
                        <Link href="/forgotpassword" >
                            Forgot password ?
                        </Link>
                    </Typography>
                </Paper>
            </Grid>
        </>
    )
}
