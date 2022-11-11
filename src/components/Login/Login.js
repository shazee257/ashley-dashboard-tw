import { useState, useRef, useEffect } from "react";
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@mui/material';
import { LockOpenOutlined } from '@mui/icons-material';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import axios from "axios";

export default function Login() {
    const { push } = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_baseURL}/users/login`,
                { email, password },
                { withCredentials: true }
            )
            .then(({ data }) => {
                if (data.status === 200) {
                    localStorage.setItem("user", JSON.stringify(data.authData));
                    push("/orders");
                } else {
                    toast.error(data.message);
                }
            }).catch(err => {
                console.log("err: ", err);
            })
    };


    useEffect(() => {
        toast.info("Login: test@gmail.com Password: test");
    }, []);

    const paperStyle = { padding: 20, width: 280, margin: "200px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }


    return (
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <p>test@gmail.com</p>
                    <p>Password: test</p> */}
                    <br /><br />
                    <TextField
                        label='Password'
                        placeholder='Enter password'
                        type='password'
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
    )
}
