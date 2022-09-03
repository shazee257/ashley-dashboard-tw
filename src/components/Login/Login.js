import { useRef, useEffect } from "react";
import axios from "axios";
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@mui/material';
import { LockOpenOutlined } from '@mui/icons-material';
import { showNotification } from "utils/helper";
import { useRouter } from "next/router";
import cookie from 'js-cookie';

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

        await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/users/login`, user)
            .then(({ data }) => {
                console.log("data: ", data);
                if (data.success) {
                    localStorage.setItem("user", JSON.stringify({
                        first_name: data.user.first_name ? data.user.first_name : "",
                        last_name: data.user.last_name ? data.user.last_name : "",
                        email: data.user.email,
                        image: data.user.image ? data.user.image : null,
                        role: data.user.role,
                    }));
                    localStorage.setItem("token", data.session.token);
                    cookie.set('token', data.session.token, { expires: 1 });
                    showNotification("success", data.message);
                    push("/brands");
                }
            }).catch(err => showNotification(err));
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
                        {/* <FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label="Remember me" /> */}
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
