import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';

const StoreRegister = () => {

  let navigate = useNavigate()


  let params = useParams()

  console.log(params.user_id);


  const [form, setform] = useState({
    name: "",
    email: "",
    address: "",
    user_id: params.user_id
  })

  const [error, seterror] = useState()

  console.log(form);


  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const data = await axios.post("http://localhost:5000/create_store", {
      name: form.name,
      email: form.email,
      address: form.address,
      user_id: form.user_id
    });

    seterror(data.data)

    console.log(data.data);


    if (data.data.success) {
      setform({ name: "", email: "", address: "" })
      navigate("/login")
    }
  };

  useEffect(()=>{
    let user = JSON.parse(localStorage.getItem('user'))

    console.log(user);

    if(!params.user_id){
      navigate('/sign')
    }
  })


  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:"center", height:'100vh'}}>
      <h1>Store Register</h1>

      {
        error?.mess ?
          <Alert severity={error?.success ? 'success' : 'error'}>{error?.mess}</Alert>
          : null
      }


      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", width:'50vw' }}>
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




        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Box>
    </div>
  )
}

export default StoreRegister