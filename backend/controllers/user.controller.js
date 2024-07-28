import { Folder } from "../models/folder.model.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new Error(error)
    }
}

const registerUser = async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullname, email, password } = req.body
    //console.log("email: ", email);

    if (
        [fullname, email, password].some((field) => field?.trim() === "")
    ){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }

    const existedUser = await User.findOne({email: email})
    

    if (existedUser) {
        return res.status(409).json({
            success:false,
            message:"User with email or username already exists",
        });
    }

    const user = await User.create({
        fullname,
        email,
        password,
    });
    const rootFolder = await Folder.create({
        name: "root",
        location: "/",
        userId: user._id,
        childrenFolders: [],
        childrenFiles: [],
    });
    user.rootFolder = rootFolder._id;
    await user.save();
    await rootFolder.save();

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while registering the user",
        });
    }

    return res.status(201).json({
        success:true,
        message:"User registered Successfully",
        data: createdUser
    });
}

const loginUser = async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body

    if (!email && !password) {
        return res.status(400).json({
            success:false,
            message:"username or email is required",
        });
    }

    try {
        const user = await User.findOne({email:email})
    
        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User does not exist",
            });
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if (!isPasswordValid) {
            return res.status(401).json({
                success:false,
                message:"Invalid user credentials",
            });
        }
    
       const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success:true,
            message:"User logged In Successfully",
            data: {
                user: loggedInUser,
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        console.log("Error occurred while logging in the user",error)
        return res.status(500).json({
            error,
            success:false,
            message:"Something went wrong while logging in the user",
        });
    }
}

const logoutUser = async(req, res) => {
    // remove refresh token from db
    // clear cookies
    // return res

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken",)
    .json({
        success:true,
        message:"User logged Out Successfully",
    })
}

const refreshAccessToken = async (req, res) => {
    // get refresh token from cookies or body
    // check if refresh token exists
    // verify refresh token
    // get user from db
    // check if user exists
    // check if refresh token is valid
    // generate new access and refresh token
    // send new access and refresh token
    

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success:false,
            message:"Refresh token is required",
        });
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            return res.status(401).json({
                success:false,
                message:"Invalid refresh token",
            });
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({
                success:false,
                message:"Refresh token is expired or used",
            });            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success:true,
            message:"Access token refreshed",
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        })
    } catch (error) {
        console.log("Error occurred while refreshing access token",error)
        return res.status(401).json({
            success:false,
            message:"Error occurred while refreshing access token",
        });
    }

}

const getCurrentUser = async(req, res) => {
    return res
    .status(200)
    .json({
        success:true,
        message:"User fetched successfully",
        data: req.user
    })
}


export {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser}