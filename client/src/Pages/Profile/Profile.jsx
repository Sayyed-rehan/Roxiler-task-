import React, { useState, useEffect } from 'react'
import { Alert, Box, Button, Divider, InputLabel, MenuItem, Select, Stack, TextField, Typography, useForkRef } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router';
import validator from 'validator';


const Profile = () => {


    const navigate = useNavigate()

    const [password, setpassword] = useState("")
    // console.log(password);

    let user = JSON.parse(localStorage.getItem('user'))
    const [userData, setuserData] = useState(user)
  const [error, seterror] = useState({})


    const [userForm, setuserForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: ''
    })

    const [storeform, setstoreform] = useState({
        name: "",
        email: "",
        address: "",
        user_id: 0
    })

    let codn = { minLength: 8, minUppercase: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    const checkPassword = userForm.password ? validator.isStrongPassword(userForm.password, codn) : true
    const emailCheck = userForm.email ? validator.isEmail(userForm.email) : true
    const checkName = userForm.name ? validator.isAlpha(userForm.name, 'en-IN', { ignore: '\s' }) : true

    console.log('checkPassword', checkPassword, emailCheck, checkName);


    const handleUpdatePassword = async () => {
        const data = await axios.patch('http://localhost:5000/update', {
            email: user[0].email,
            password: password
        })
        console.log(data.data);
        setuserData(data.data.udpatedData)
        setpassword('')
        localStorage.setItem('user', JSON.stringify(data.data.udpatedData));
    }

    const handleInputChange = (e) => {
        setuserForm({ ...userForm, [e.target.name]: e.target.value })
    }

    console.log(userForm);

    const handleAddUser = async () => {
        const data = await axios.post('http://localhost:5000/signup', {
            name: userForm.name,
            email: userForm.email,
            address: userForm.address,
            password: userForm.password,
            role: userForm.role
        })

        console.log(data.data);
        seterror(data.data)


        if (data.data.success) {

            if (userForm.role == 'Owner') {
                setstoreform({ ...storeform, user_id: data?.data?.data?.insertId })
            } else {
                setuserForm({ name: "", email: "", address: "", password: "", role: "" })
            }
        }
    }

    const handleStoreChange = (e) => {
        setstoreform({ ...storeform, [e.target.name]: e.target.value })
    }

    const handleAddStore = async () => {
        const data = await axios.post("http://localhost:5000/create_store", {
            name: storeform.name,
            email: storeform.email,
            address: storeform.address,
            user_id: storeform.user_id
        });

        console.log(data.data);

        if (data.data.success) {
            setuserForm({ name: "", email: "", address: "", password: "", role: "" })
            setstoreform({ name: "", email: "", address: "" })

        }
    }

    useEffect(() => {

        return () => {
            console.log("i'm cleaning up");
        }

    }, [userData, user])

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'))

        console.log(user);

        if (!user) {
            navigate("/login")
        }
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-around", alignItems: 'center', marginTop: "20px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5vh", width: '30vw', p: "20px", mb: '20px', bgcolor: '#eceff1', borderRadius: "15px" }}>
                <Typography>Name: {user && userData[0]?.name || null}
                    <Divider />
                </Typography>
                <Typography>Email: {user && userData[0]?.email || null}
                    <Divider />
                </Typography>

                <Typography>Address: {user && userData[0]?.address || null}
                    <Divider />
                </Typography>

                <Typography>Role: {user && userData[0]?.role || null}
                    <Divider />
                </Typography>

                <Typography>Password: {user && userData[0]?.password || null}
                    <Divider />
                </Typography>

                <TextField id="standard-basic" label="Update Password" variant="standard" value={password}
                    onChange={(e) => setpassword(e.target.value)} />
                <Button variant='contained' onClick={handleUpdatePassword} disabled={password.length == 0}>Update Password</Button>
            </Box>

            {/* Add Users */}
            <Box sx={{ display: user && user[0].role == 'Administrator' ? 'flex' : 'none', flexDirection: 'column', gap: "10px", p: "20px", bgcolor: '#eceff1', borderRadius: '15px' }} width='600px'>


                <h1>ADD USER</h1>

                {
                    error.mess ?
                        <Alert severity={error?.success ? 'success' : 'error'}>{error?.mess}</Alert>
                        : null
                }
                <TextField placeholder='Name' name='name' value={userForm.name} onChange={handleInputChange} error={checkName == false}></TextField>
                <TextField placeholder='Email' name='email' value={userForm.email} onChange={handleInputChange} error={emailCheck == false}></TextField>
                <TextField placeholder='Address' name='address' value={userForm.address} onChange={handleInputChange}></TextField>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={userForm.role}
                    // label="Role"
                    onChange={(e) => setuserForm({ ...userForm, role: e.target.value })}
                >
                    <MenuItem value='User'>User</MenuItem>
                    <MenuItem value='Owner'>Store Owner</MenuItem>
                    <MenuItem value='Administrator'>Admin</MenuItem>

                </Select>
                <TextField placeholder='Password' name='password' type='password' value={userForm.password} onChange={handleInputChange}></TextField>
                <Button variant='contained' onClick={handleAddUser}
                    disabled={emailCheck === false || checkName == false || checkPassword == false || userForm.password.length > 16}>
                    Add User
                </Button>
            </Box>

            {
                userForm.role == 'Owner'
                    ? <>
                        <h1>ADD Stores</h1>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", p: '20px', bgcolor: '#eceff1', borderRadius: '15px', mb: "20px" }} width='600px'>
                            <TextField
                                id="outlined-basic"
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={storeform.name}
                                onChange={handleStoreChange}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Emial"
                                name="email"
                                variant="outlined"
                                value={storeform.email}
                                onChange={handleStoreChange}
                            />

                            <TextField
                                id="outlined-basic"
                                label="address"
                                name="address"
                                variant="outlined"
                                value={storeform.address}
                                onChange={handleStoreChange}
                            />

                            <Button onClick={handleAddStore} variant="contained" color='secondary'>
                                Add Store
                            </Button>
                        </Box>
                    </>

                    : null
            }




        </div>
    )
}

export default Profile