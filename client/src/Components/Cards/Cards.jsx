import React, { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Rating,
    Typography,
} from "@mui/material";
import axios from "axios";
const Cards = (props) => {
    // console.log(props.store_data.id);

    const [ratingModal, setratingModal] = useState(false);
    const [ratingGiven, setratingGiven] = useState(0);
    const [errorGot, seterrorGot] = useState(null);
    let user = JSON.parse(localStorage.getItem("user"));
    const [ratingGiventoStore, setratingGiventoStore] = useState([])


    const handleRating = async () => {
        // let user = JSON.parse(localStorage.getItem("user"));
        // console.log(user[0]);


        let data = await axios.post("http://localhost:5000/submit_rating", {
            user_id: user[0].id,
            store_id: props.store_data.id,
            rating: ratingGiven,
        });

        console.log(data.data);

        if (data.data.success == false) {
            seterrorGot(data.data);
        } else {
            props.updateApiSuccess(data.data.success);
            seterrorGot(data.data);
            setratingModal(false)

        }
    };

    const handleRatingChange = (e) => {
        console.log(e.target.value);
        setratingGiven(e.target.value);
    };

    // console.log(errorGot);

    const handleUpdateRating = async () => {
        // let user = JSON.parse(localStorage.getItem("user"));

        const data = await axios.patch("http://localhost:5000/update_rating", {
            user_id: user[0].id,
            store_id: props.store_data.id,
            rating: ratingGiven,
        });

        console.log(data.data);

        if (data.data.success) {
            props.updateApiSuccess(data.data.success);
            seterrorGot(data.data);
            
            setratingModal(false)

        }else{
            seterrorGot(data.data);
        }
    };


    const fetchRatingsByUser = async()=>{
        const data = await axios.get(`http://localhost:5000/get_ratings_by_user/${user[0].id}`)
        setratingGiventoStore(data.data.data)
        
    }
    
    useEffect(()=>{
        fetchRatingsByUser()
    },[])

    
    
    // console.log(ratingGiventoStore)
   
    
    let findStore = ratingGiventoStore.find((item)=>item.store_id  == props.store_data.id)
    let findStoreBoolean = Boolean(findStore)
    console.log('filter',findStore);


    return (
        <div>
            {errorGot ? <Alert severity={errorGot.success ? 'success': 'error'}>{errorGot?.mess?.message}</Alert> : null}
            <Card sx={{ minWidth: 275, boxShadow: 12 }}>
                <CardContent>
                    <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                        {props.store_data.email}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {props.store_data.name}
                    </Typography>

                    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                        {props.store_data.address}
                    </Typography>
                    <Typography variant="body2">{props.store_data.rating} ⭐</Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => setratingModal(!ratingModal)}
                        sx={{display: user && user[0].role=='User'? 'block':'none'}}
                    >
                        Rating
                    </Button>
                    {ratingModal ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent:'space-between', gap:'0.5vw' }}>
                            <Rating
                                name="size-large"
                                defaultValue={findStoreBoolean ? +findStore?.rating : 0}
                                size="large"
                                onChange={handleRatingChange}
                            />
                            <Button variant="outlined"  onClick={handleRating}>Submit</Button>

                            {
                                findStoreBoolean ? 
                            <Button variant="outlined" onClick={handleUpdateRating}>
                                Update Rating
                            </Button>
                            : null
                            }
                        </Box>
                    ) : null}
                </CardActions>
            </Card>
        </div>
    );
};

export default Cards;
