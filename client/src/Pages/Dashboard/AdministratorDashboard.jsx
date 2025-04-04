import React, { useState, useEffect } from 'react'
import { Avatar, Box, Button, Card, CardActions, CardContent, FormControl, InputLabel, Menu, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import Cards from '../../Components/Cards/Cards';
import axios from 'axios';

const AdministratorDashboard = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    let navigate = useNavigate()

    const [data, setdata] = useState([])


    const [apiParams, setapiParams] = useState({
        name: "",
        address: "",
        role: "",
        email: ""
    });

    console.log(apiParams);

    const [countOfAllTables, setcountOfAllTables] = useState({})

    const [url, seturl] = useState("")

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchData = async () => {
        const data = await axios.get(url)
        // console.log(data.data);
        setdata(data.data.data);
    }

    const fetchCountOfAllTables = async () => {
        const data = await axios.get('http://localhost:5000/get_count_of_all_tables')
        // console.log(data.data.data);
        setcountOfAllTables(data.data.data)
    }

    const handleChange = (e) => {
        setapiParams({ ...apiParams, [e.target.name]: e.target.value });
    };

    const handleMenuClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }


    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate("/login")
    }

    const handleViewData = (e) => {
        console.log(e.target.value);
        if (e.target.value == 'users') {
            seturl(`http://localhost:5000/allusers?name=${apiParams.name}&email=${apiParams.email}&role=${apiParams.role}&address=${apiParams.address}`)
        } else {
            seturl(`http://localhost:5000/all_stores?name=${apiParams.name}&address=${apiParams.address}`)
        }
    }

    useEffect(() => {
        console.log("i m called");
        fetchData()
        fetchCountOfAllTables()
    }, [url, apiParams])

    console.log(url);

    return (
        <div>
            <h1>System Administrator</h1>

            <Box sx={{ display: "flex", gap: "2vw" }}>
                <TextField
                    id="outlined-basic"
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={apiParams.name}
                    onChange={handleChange}
                />

                <TextField
                    id="outlined-basic"
                    label="Email"
                    name="email"
                    variant="outlined"
                    value={apiParams.email}
                    onChange={handleChange}
                />

                <TextField
                    id="outlined-basic"
                    label="Address"
                    name="address"
                    variant="outlined"
                    value={apiParams.address}
                    onChange={handleChange}
                />

                <FormControl sx={{width:'200px'}}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={apiParams.role}
                        label="Role"
                        onChange={(e)=>setapiParams({...apiParams, role:e.target.value})}
                    >
                        <MenuItem value=''>Select From Below</MenuItem>

                        <MenuItem value='User'>User</MenuItem>
                        <MenuItem value='Owner'>Store Owner</MenuItem>
                    </Select>
                </FormControl>



                <Avatar sx={{ bgcolor: "#673ab7", cursor: 'pointer' }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuClick}
                >
                    {user[0].name[0].toUpperCase()}
                </Avatar>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                >
                    <MenuItem onClick={() => navigate("/profile")}>
                        Profile
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>

                {/* all users */}
                <Card sx={{ minWidth: 400 }}>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Total number of Users : {countOfAllTables?.users}
                        </Typography>

                    </CardContent>
                    <CardActions>
                        <Button size="small" variant='outlined' value='users' onClick={handleViewData}>
                            View All users
                        </Button>
                    </CardActions>
                </Card>
                {/* all stores */}
                <Card sx={{ minWidth: 400 }}>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Total number of Stores : {countOfAllTables?.stores}
                        </Typography>

                    </CardContent>
                    <CardActions>
                        <Button size="small" variant='outlined' value='stores' onClick={handleViewData}>
                            View All Stores
                        </Button>
                    </CardActions>
                </Card>
                {/* all ratings  */}
                <Card sx={{ minWidth: 400 }}>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Total  Ratings : {countOfAllTables?.ratings}
                        </Typography>

                    </CardContent>
                    <CardActions>
                        {/* <Button size="small" variant='outlined'>View Details</Button> */}
                    </CardActions>
                </Card>
            </Box>


            {/* show Data */}
            <Box sx={{ display: "flex", flexDirection: "row", gap: "2vw", flexWrap: "wrap", paddingTop: "2vh", }}>
                {data && data.length > 0
                    ? data.map((item, index) => {
                        return (
                            <Cards
                                store_data={item}
                                key={item.id}
                            />
                        )
                    })
                    : <h1>No Data</h1>
                }
            </Box>
        </div>
    )
}

export default AdministratorDashboard