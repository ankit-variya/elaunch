const {
    insert,
    findById,
    list,
    update,
    deletedata,
} = require("../models/commonModel");
const { postsValidationSchema } = require("../validation");
const jwt = require("jsonwebtoken");
let tableName = "users";


const registration = async (req, res, next) => {
    try {

        const body = req.body;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const location = await findById('locations', { country: body.country, state: body.state, });

        let locationId = location.data[0].id;
        const checkEmail = await findById(tableName, { email: email });
        if (checkEmail.data.length > 0) throw new Error("your email is exist");

        const checkMobile = await findById(tableName, { mobile: mobile });
        if (checkMobile.data.length > 0) throw new Error("your mobile is exist");


        // client.upload(myFile)

        const usersObj = {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            mobile: body.mobile,
            password: body.password,
            gender: body.gender,
            locationId: locationId,
            profileImage: req.file.filename
        };

        const validation = await validate(body);
        console.log('validation', validation)

        const token = jwt.sign(usersObj, "abcdefgh", { expiresIn: "1h" });
        console.log("token", token);

        usersObj.token = token;

        const insertedData = await insert(tableName, usersObj);
        if (!insertedData.data) throw new Error("data is not inserted");

        const record = await findById(tableName, { id: insertedData.data[0] });

        res.send({
            data: record.data,
        });
    } catch (error) {
        res.send({
            error: error.message,
        });
    }
};

const validate = async (body) => {
    // switch (action) {
    //   case "register":
    //     validationSchema = postsValidationSchema;
    //     break;
    // }

    console.log('--body', body)
    //  console.log('typeof validationSchema', validationSchema)
    if (typeof postsValidationSchema != "undefined") {
        const validateData = postsValidationSchema.validate(body);

        if (validateData.error && validateData.error !== null) {
            throw new Error(validateData.error.message);
        }

        return validateData;
    }
};


module.exports = registration;