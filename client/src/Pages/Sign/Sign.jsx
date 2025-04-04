import React, { useState } from "react";
import { Alert, Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";

const Sign = () => {
  
  let navigate = useNavigate()

  const [form, setform] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "User",
  });

  const [error, seterror] = useState({})

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    let data = await axios.post("http://localhost:5000/signup", {
      name: form.name,
      email: form.email,
      address: form.address,
      password: form.password,
      role: form.role,
    });

    seterror(data.data)

    console.log(data.data);


    if (data.data.success && form.role == 'User') {
      setform({ name: "", email: "", address: "", password: "" })
      navigate("/login")
    }else{
      navigate(`/StoreRegister/${data.data.data.insertId}`)
    }


  };

  console.log(form);
  // console.log(error?.mess);

  return (
    <div>
      <h1>Sign up</h1>
      {
        error.mess ?
          <Alert severity={error?.success ? 'success' : 'error'}>{error?.mess}</Alert>
          : null
      }

      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <TextField
          id="outlined-basic"
          label="Name"
          name="name"
          variant="outlined"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          label="Emial"
          name="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
        />

        <TextField
          id="outlined-basic"
          label="address"
          name="address"
          variant="outlined"
          value={form.address}
          onChange={handleChange}
        />

        {/* role */}

        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={form.role}
          label="Age"
          onChange={(e)=>setform({...form,  role : e.target.value})}
        >
          <MenuItem value='User'>User</MenuItem>
          <MenuItem value='Owner'>Store Owner</MenuItem>
          {/* <MenuItem value={30}>Thirty</MenuItem> */}
        </Select>

        <TextField
          id="outlined-basic"
          label="password"
          name="password"
          variant="outlined"
          value={form.password}
          onChange={handleChange}
        />

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default Sign;
