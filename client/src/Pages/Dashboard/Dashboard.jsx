import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Box, Card, CardContent, Menu, MenuItem, TextField, Typography } from "@mui/material";
import Cards from "../../Components/Cards/Cards";
import { useNavigate } from "react-router";


const Dashboard = () => {

    useEffect(()=>{
        console.log("ASSSSS");
        let user = JSON.parse(localStorage.getItem('user'))
        if(!user){
            navigate("/login")
        }
    })

    let navigate = useNavigate()
    // all useStates hooks

    const [stores, setstores] = useState([]);

    const [apiSuccess, setapiSuccess] = useState("");

    const [apiParams, setapiParams] = useState({
        name: "",
        address: "",
    });

    const user = JSON.parse(localStorage.getItem("user"));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [avg_ratings, setavg_ratings] = useState()

    // all useStates hooks

    const handleChange = (e) => {
        setapiParams({ ...apiParams, [e.target.name]: e.target.value });
    };

    const fetchStoreAll = async () => {
        const user = JSON.parse(localStorage.getItem('user'))


        const user_url = `http://localhost:5000/all_stores?name=${apiParams.name}&address=${apiParams.address}`
        const owner_url = `http://localhost:5000/get_ratings/${user[0]?.id}`

        let url;
        if (user[0].role == 'User') {
            url = user_url
        } else if (user[0].role == 'Owner') {
            url = owner_url
        } else {

        }
        const data = await axios.get(url);

        console.log(data.data);
        setstores(data.data.data);
        setavg_ratings(data.data?.avg_rating)
    };





    console.log(stores);

    const updateApiSuccess = (data) => {
        setapiSuccess(!apiSuccess);
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


   

    useEffect(() => {
        fetchStoreAll();
    }, [apiParams, apiSuccess]);


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "1vw",
                paddingRight: "2vw",
                gap: "2vh",
            }}
        >
            <h1>Dashboard</h1>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: user && user[0]?.role == 'User' ? "flex" : 'none', gap: "2vw" }}>
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
                        label="Address"
                        name="address"
                        variant="outlined"
                        value={apiParams.address}
                        onChange={handleChange}
                    />
                </Box>

                <Box sx={{ display: user && user[0]?.role == 'Owner' ? "flex" : 'none', flexDirection:'column', gap: "2vw" }}>
                    <h2>Shop Details</h2>
                    <Card sx={{boxShadow:12}}>
                        <CardContent>
                            <Typography gutterBottom
                                sx={{ color: "text.secondary", fontSize: 14 }}>{avg_ratings?.email}</Typography>
                            <Typography variant="h5" component="div">{avg_ratings?.name}</Typography>
                            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>{avg_ratings?.address}</Typography>
                            <Typography variant="body1">Avg-Ratings:  {avg_ratings?.rating}⭐</Typography>

                        </CardContent>
                    </Card>
                </Box>
                <Avatar sx={{ bgcolor: "#673ab7", cursor: 'pointer' }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuClick}
                >
                    { user && user[0].name[0].toUpperCase()}
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
            <Typography variant="h6">{user && user[0].role=='User'?'Shop Details' :'Customer Ratings'}</Typography>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2vw",
                    flexWrap: "wrap",
                    paddingTop: "2vh",
                }}
            >
           
                {stores && stores.length > 0 ? (
                    stores.map((item, index) => {
                        return (
                            <Cards
                                store_data={item}
                                updateApiSuccess={updateApiSuccess}
                                key={item.id}
                            />
                        );
                    })
                ) : (
                    <h1>No data</h1>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
