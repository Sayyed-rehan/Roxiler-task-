import React, { useState, useEffect } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Login = () => {

  let navigate = useNavigate()
  const [form, setform] = useState({
    email: "",
    password: ""
  })

  const [error, seterror] = useState({})


  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const [showPassword, setshowPassword] = useState(false)
  const handleClickShowPassword = () => setshowPassword((show) => !show);
  const handleMouseDownPassword = () => setshowPassword(!showPassword);

  // console.log(form);

  const handleLogin = async () => {
    let data = await axios.post('http://localhost:5000/login', {
      email: form.email,
      password: form.password
    })

    console.log(data.data);
    seterror(data.data)

    if (data.data.success && data.data.data[0].role != 'Administrator') {
      setform({ email: "", password: "" })
      localStorage.setItem('user', JSON.stringify(data.data.data))
      navigate("/")
    } else if (data.data.data[0].role == 'Administrator') {
      localStorage.setItem('user', JSON.stringify(data.data.data))
      navigate("/System Administrator")
    } else {
      seterror()
    }
  }

  useEffect(()=>{
    let user = JSON.parse(localStorage.getItem('user'))

    console.log(user);

    if(user && user[0].role == 'Administrator'){
      navigate("/System Administrator")
    }else if(user){
      navigate("/")
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", height: '100vh' }}>
      <h1>Login</h1>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: "5vh" }} width="600px">
        {
          error?.mess ?
            <Alert severity={error?.success ? 'success' : 'error'}>{error?.mess}</Alert>
            : null
        }

        <TextField
          id="outlined-basic"
          label="Email"
          name="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          label="password"
          name="password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button variant="contained" onClick={handleLogin}>Login</Button>
        <Button variant="contained" color="error" onClick={() => navigate("/sign")}>Sign</Button>

      </Box>
    </div>
  );
};

export default Login;
