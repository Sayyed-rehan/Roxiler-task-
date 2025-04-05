import React, { useState } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect } from "react";
import validator from 'validator';

const Sign = () => {

  let navigate = useNavigate()

  let user = localStorage.getItem('user')

  console.log(user);

  const [form, setform] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "User",
  });
  let codn = { minLength: 8, minUppercase: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
  const checkPassword = form.password ? validator.isStrongPassword(form.password, codn) : true
  const emailCheck = form.email ? validator.isEmail(form.email) : true
  const checkName = form.name ? validator.isAlpha(form.name, 'en-IN', { ignore: '\s' }) : true

  console.log('checkPassword',checkPassword, emailCheck, checkName);

  const [error, seterror] = useState({})

  const [showPassword, setshowPassword] = useState(false)
  const handleClickShowPassword = () => setshowPassword((show) => !show);
  const handleMouseDownPassword = () => setshowPassword(!showPassword);

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
    } else {
      navigate(`/StoreRegister/${data.data.data.insertId}`)
    }


  };

  console.log(form);
  // console.log(error?.mess);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'))

    console.log(user);

    if (user && user[0].role == 'Administrator') {
      navigate("/System Administrator")
    } else if (user) {
      navigate("/")
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", height: '100vh' }}>
      <h1>Sign up</h1>
      {
        error.mess ?
          <Alert severity={error?.success ? 'success' : 'error'}>{error?.mess}</Alert>
          : null
      }

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", width: '70vw' }}>
        <TextField
          id="outlined-basic"
          label="Name"
          name="name"
          variant="outlined"
          value={form.name}
          onChange={handleChange}
          error={checkName==false}
        />
        <TextField
          id="outlined-basic"
          label="Emial"
          name="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          error={emailCheck==false}
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
          onChange={(e) => setform({ ...form, role: e.target.value })}
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

        <Button onClick={handleSubmit} variant="contained" sx={{ mt: "30px" }} disabled={emailCheck === false || checkName == false || checkPassword == false || form.password.length>16}>
          Sign Up
        </Button>
        <Button variant="contained" color="error" onClick={() => navigate("/login")}>Already Have Account</Button>

      </Box>
    </div>
  );
};

export default Sign;
