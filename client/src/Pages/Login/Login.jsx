import React, { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
const Login = () => {

    let navigate = useNavigate()
    const [form, setform] = useState({
        email:"",
        password:""
    })

    const [error, seterror] = useState({})


    const handleChange = (e)=>{
        setform({...form, [e.target.name]: e.target.value})
    }

    // console.log(form);

    const handleLogin = async()=>{
        let data = await axios.post('http://localhost:5000/login',{
            email: form.email,
            password: form.password
        })

        console.log(data.data.data[0]);
        seterror(data.data)

        if(data.data.success && data.data.data[0].role != 'Administrator'){
            setform({email:"", password:""})
            localStorage.setItem('user', JSON.stringify(data.data.data))
            navigate("/")
        }else{
          localStorage.setItem('user', JSON.stringify(data.data.data))
          navigate("/System Administrator")
        }
    }

  return (
    <div>
      <h1>Login</h1>
      <Box sx={{display:'flex', flexDirection:'column', gap:"5vh"}}>
      {
        error?.mess ? 
        <Alert severity={error?.success ? 'success':'error'}>{error?.mess}</Alert>
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
          type='password'
          value={form.password}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleLogin}>Login</Button>
        <Button variant="contained" color="error" onClick={()=>navigate("/sign")}>Sign</Button>

      </Box>
    </div>
  );
};

export default Login;
