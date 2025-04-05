import express, { json } from "express";
import { checkConnection, pool } from "./MySQL/Connection.js";
const app = express();
import createAllTable from "./MySQL/User.js";
import password_hash from "password-hash";
import cors from "cors";

app.use(express.json());
app.use(cors());

// console.log(await pool.execute(`show databases`));
// console.log(password.generate("rehan"));
// console.log(password.verify('reha', 'sha1$b32a505e$1$7c323afb573b6c2e16ee5ca99845e0e7a06a69be'));
//? create

//? signup
app.post("/signup", async (req, res) => {
    let { name, email, address, password, role } = req.body;

    // console.log(req.body);

    try {
        if (!name || !email || !address || !password || !role) {
            throw new Error("Missing required parameters!");
        }
        const [data] = await pool.execute(`
        insert into Users(name, email, address, password, role) 
        values('${name}', '${email}', '${address}', '${password}', '${role}')
        `);

        res.json({
            success: true,
            mess: "user Added",
            data: data,
        });
    } catch (e) {
        res.json({
            success: false,
            mess: e.message,
        });
    }
});

//? login
app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("Missing required parameters!");
        }

        let [data] = await pool.execute(`
        select * from Users
        where email = '${email}' and password = '${password}' 
        `);
        if (data.length != 0) {
            res.json({
                success: true,
                mess: "logined",
                data: data,
            });
        } else {
            throw new Error("Invalid Credentails");
        }
    } catch (error) {
        res.json({
            success: false,
            mess: error.message,
        });
    }

    // let [data] = await pool.execute(`
    //     select * from Users
    //     where email = '${email}' and password = '${password}'
    // `);

    // if (data.length != 0 && check) {
    //     res.json({
    //         success: true,
    //         mess: "logined",
    //         data: data,
    //     });
    // } else {
    //     res.status(401).json({
    //         success: false,
    //         mess: "invalid",
    //     });
    // }
});

//! Create User (Admin only)
app.post("/", async (req, res) => { });

//? Get All Users (Admin only)
app.get("/allusers", async (req, res) => {
    let { name, address, role, email } = req.query;

    console.log(req.query);

    name = name || null;
    address = address || null;
    role = role || null;
    email = email || null;



    try {
        let [data] = await pool.execute(`
            select * from Users
            where  role != 'Administrator'
            AND (? IS NULL OR name LIKE CONCAT('%', ?, '%'))
            AND (? IS NULL OR address LIKE CONCAT('%', ?, '%'))
            AND (? IS NULL OR role LIKE CONCAT('%', ?, '%'))
            AND (? IS NULL OR email LIKE CONCAT('%', ?, '%'))

            `,
            [name, name, address, address, role, role, email, email]
        );
        res.json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

//? update password
app.patch("/update", async (req, res) => {
    const { email, password } = req.body;
    try {
        const [data] = await pool.execute(`
        update Users
        set password = "${password}"
        where email = "${email}"`);

        const [udpatedData] = await pool.execute(`
            select *
            from Users
            where email = "${email}"
        `);

        res.json({
            success: true,
            mess: "password udpated succes",
            udpatedData: udpatedData,
            data: data,
        });
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

//? Create Store
//* Description: Add a new store (Admin functionality).
app.post("/create_store", async (req, res) => {
    const { name, email, address, user_id } = req.body;

    console.log(req.body);

    try {
        const [data] = await pool.execute(`
            insert into stores(name, email, address, user_id)
            values('${name}', '${email}', '${address}', '${user_id}')
        `);

        console.log(data);

        res.json({
            success: true,
            mess: "Store added successfully",
            data: data,
        });
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

// ? Get All Stores
//! Description: Retrieve a list of stores with filtering options.
app.get("/all_stores", async (req, res) => {
    let { name, address } = req.query;

    name = name || null;
    address = address || null;

    // console.log(name,address);

    try {
        const [data] = await pool.execute(
            `SELECT *
            FROM stores
            WHERE (? IS NULL OR name LIKE CONCAT('%', ?, '%'))
              AND (? IS NULL OR address LIKE CONCAT('%', ?, '%'))
              `,
            [name, name, address, address]
        );

        res.json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

//? Submit Rating
// Description: Allow users to submit a rating for a store.
app.post("/submit_rating", async (req, res) => {
    const { user_id, store_id, rating } = req.body;

    try {
        let data = await pool.execute(`
            insert into ratings (user_id, store_id, rating)
            values('${user_id}', '${store_id}', '${rating}')
        `);

        await pool.execute(`
            update stores
            set rating = (
                select SUM(rating)/count(*) as  avg_rating
                from ratings
                where store_id = '${store_id}'
            )
            where id = '${store_id}'
        `);

        res.json({
            success: true,
            mess: "Rating submitted successfully",
            // all_ratings:all_ratings[0].avg_rating
            // data: data,
            // current_store: current_store
        });
        console.log("down");
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

//? Update Rating
// Description: Allow users to update their submitted rating.
app.patch("/update_rating", async (req, res) => {
    const { user_id, store_id, rating } = req.body;

    try {
        let [findUser] = await pool.execute(`
            select *
            from ratings
            where user_id = '${user_id}' and store_id = '${store_id}'
        `);

        console.log(findUser);

        if (findUser.length == 0) {
            throw new Error("User has not submitted rating");
        }

        await pool.execute(`
            update ratings
            set rating = '${rating}'
            where user_id = '${user_id}' and store_id = '${store_id}'
        `);
        await pool.execute(`
            update stores
            set rating = (
                select SUM(rating)/count(*) as  avg_rating
                from ratings
                where store_id = '${store_id}'
            )
            where id = '${store_id}'
        `);

        res.json({
            success: true,
            mess: "Rating updated successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            mess: error,
        });
    }
});

//? Get Ratings for a Store
// Description: Retrieve ratings submittd for a specific store (Store Owner functionality).
// app.get("/get_ratings/:storeid", async (req, res) => {
//     let store_id = req.params.storeid;

//     try {
//         let [data] = await pool.execute(`
//             select *
//             from ratings
//             JOIN users
//             on ratings.user_id = users.id
//             where store_id = '${store_id}'
//         `);

//         let [avg_rating] = await pool.execute(`
//             select *
//             from stores
//             where id = '${store_id}'
//         `)

//         res.json({
//             success: true,
//             avg_rating:avg_rating,
//             data: data,
//         });
//     } catch (error) {
//         res.json({
//             success: false,
//             mess: error,
//         });
//     }
// });

//get all rating for the Owner with all his store
app.get("/get_ratings/:owner_id", async (req, res) => {
    let owner_id = req.params.owner_id;
    console.log("owner", owner_id);
    try {
        const [data] = await pool.execute(`
        select *
        from rolex.users as uu
        join rolex.ratings as rr
        on rr.user_id = uu.id
        where uu.id in  (select r.user_id
        from rolex.users as u
        join rolex.stores as s
        on s.user_id = u.id
        join rolex.ratings as r
        on r.store_id = s.id
        where u.id = ${owner_id})
       `);

       const [avg_rating] = await pool.execute(`
        select *
        from rolex.users as u
        join rolex.stores as s
        on u.id = s.user_id
        where u.id = ${owner_id}
       `)

        res.json({
            success: true,
            data: data,
            avg_rating: avg_rating[0]
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            mess: error,
        });
    }
});

//get ratings given by user
app.get("/get_ratings_by_user/:userid", async (req, res) => {
    let user_id = req.params.userid;
    // console.log(user_id);

    const [data] = await pool.execute(`
        select *
        from ratings
        where user_id = '${user_id}'
    `);

    res.json({
        success: true,
        data: data,
    });
});


// get count of all the tables
app.get("/get_count_of_all_tables", async (req, res) => {


    const [users] = await pool.execute(`
        select count(*) as users
        from users
        where role != 'Administrator'
    `);

    const [stores] = await pool.execute(`
        select count(*) as stores
        from stores
    `);

    const [ratings] = await pool.execute(`
        select count(*) as ratings
        from ratings
    `);

    res.json({
        success: true,
        data : {
            users: users[0].users,
            stores:stores[0].stores,
            ratings:ratings[0].ratings
        }
    });
});

//? server and db connectinon
app.listen(5000, async () => {
    console.log("Server running on port 3000......");
    try {
        await checkConnection();
        await createAllTable();
    } catch (error) {
        console.log("Failed to initialize the database", error);
    }
});
