import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

    const {fullName, email, userName, password} = req.body;
    
    if(
        [fullName, email, userName, password].some((field) => field?.trim() == "")
    ){
        throw new ApiErrors(400, "All fields are required!");
    }

    const isUserExisted = await User.findOne({
        $or: [{userName}, {email}],
    })

    if(isUserExisted){
        throw new ApiErrors(409, "User with email or username already exists!");
    }

    let avatarLocalPath;

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files?.avatar[0]?.path;
    }

    let coverImgLocalPath;

    if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
        coverImgLocalPath = req.files?.coverImg[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiErrors(400, "Avatar file is required");
    }

    const avatarPath = await uploadOnCloudinary(avatarLocalPath);
    const coverImgPath = await uploadOnCloudinary(coverImgLocalPath);

    const user = await User.create({
        fullName,
        avatar: avatarPath.url,
        coverImg: coverImgPath?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiErrors(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully!")
    );




});


export {registerUser} ;