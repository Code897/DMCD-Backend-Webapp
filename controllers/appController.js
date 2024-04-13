import signUpUser from "../methods/signup.js";
import userSignIn from "../methods/signin.js";
import getUserDB from "../methods/getUser.js";
import updateUserDB from "../methods/updateUser.js";
import otpGenerator from "otp-generator"
import chalk from "chalk";
import passwordReset from "../methods/passwordReset.js";
import jwt from 'jsonwebtoken';
import axios from "axios";
import { homeDataGetDB, homeDataPostDB } from "../methods/homeData.js";
import { blogFetchAllDB, blogFetchLatestDB, blogPostDB, deleteBlog } from "../methods/blogs.js";
import { text } from "express";
import { Blog, Driver } from "../db/models/schema.js";
import { getAgeGenderCountData, getCityCountData, getReligionChartData} from "../methods/chartsData.js";
import { postDriver } from "../methods/postDriver.js";
import { IMGUR_CLIENTID, IMGUR_CLIENTSECRET, IMGUR_REFRESH_TOKEN, JWT_SECRET } from "../config.js";
// import { sendWhatsAppMessage } from "../service/whatsappMessenger.js";


export async function signUp(req, res) {
    const { name, email, phone, password,city,dateOfBirth,gender,religion} = req.body;
    try {
        console.log(chalk.yellow('Creating User'));
        const newUser = await signUpUser(name, email, phone, password,city,dateOfBirth,gender,religion);
        res.status(201).json({ message: 'User created successfully \n \n SignIn to use our website', user: newUser });
        console.log(chalk.blue("User Created"));
    } catch (error) {
        console.error(chalk.red('Error signing up user:', error));
        res.status(500).json({ error: error + '' });
    }
}


export async function signIn(req, res) {
    const { email, password } = req.body;
    try {
        const { responseUser, token } = await userSignIn(email, password);
        res.status(200).json({ responseUser, token });
        //
    } catch (error) {
        console.error(error);
    }
}

export async function getUser(req, res) {
    const { userid } = req.params;
    try {
        if (!userid) {
            return res.status(501).send({ error: "Invalid username" })
        }
        const user = await getUserDB(userid)
        res.status(200).json(user);
    } catch (error) {
        return res.status(404).send({ error: "No User Found" })
    }
}

export async function updateUser(req, res) {
    const { userid } = req.params;
    const body = req.body;
    try {
        if (!userid) {
            return res.status(501).send({ error: "Invalid username" })
        }
        const user = await updateUserDB(userid, body)
        res.status(200).json(user);
    } catch (error) {
        return res.status(404).send({ error: "No " })
    }
}
export async function generateOTP(req, res) {
    const{phone}=req.body
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    // sendWhatsAppMessage(`+91${phone}`,req.app.locals.OTP)
    res.status(200).send({ code: req.app.locals.OTP })
}
export async function verifyOTP(req, res) {
    const { code } = req.body;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(200).send({ message: 'Verify Successfull' })
    }
    return res.status(400).send({ error: 'Invalid OTP' })
}

export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false
        return res.status(201).send({ message: "Access Granted" })
    }
    return res.status(400).send({ error: 'Session Expired' })
}

export async function resetPassword(req, res) {
    if (!req.app.locals.resetSession) {
        return res.status(400).send({ error: 'Session expired' })
    }
    const { email, phone, password } = req.body;
    const identifier = email ? { value: email, type: 'email' } : phone ? { value: phone, type: 'phone' } : null;
    if (!identifier) {
        res.status(400).send({ error: 'Email or phone is required' });
        return;
    }
    try {
        const user = await passwordReset(identifier, password);
        res.status(200).send({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error + '' });
    }
}

export async function authenticateUser(req, res) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = User.findOne({ email: email });
        if (!exist) {
            return res.status(404).send({ error: " User Not Found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Authentication Error" })
    }
}

export function tokenCheck(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        jwt.verify(token,JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            } else {
                req.user = decoded;
                return res.status(200).json({ message: "Token Verified ✔😊" })
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function homeDataPost(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const response = homeDataPostDB(req.file, req.body.text,req.body.title)
        res.status(200).json({ message: "Home Data Change Successfully" });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to change Home Data' });
    }
}
export async function homeDataGet(req, res) {
    try {
        const response = await homeDataGetDB()
        res.status(200).json({ response });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get Home Data' });
    }
}

export async function blogPost(req, res) {
    const { highlights, postStory } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const response = blogPostDB(req.file, highlights, postStory)
        res.status(200).json({ message: "Blog Posted Successfully" });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to Post Blog' });
    }
}

export async function blogFetchLatest(req, res) {
    try {
        const blogs = await blogFetchLatestDB()
        return res.status(200).json({ blogs })
    } catch (error) {
        throw error
    }
}

export async function blogFetchAll(req, res) {
    const offset = parseInt(req.query.offset);
    try {
        const {blogs,totalBlogsCount} = await blogFetchAllDB(offset)
        return res.status(200).json({ blogs,totalBlogsCount })
    } catch (error) {
        throw error
    }
}

export async function blogfetch(req, res) {
    const { blogid } = req.params;
    try {
        const blog = await Blog.findOne({ _id: blogid });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function blogdelete(req, res) {
    const { blogid } = req.body;
    try {
        await deleteBlog(blogid)
        res.status(200).send({ message: "Post deleted Successfully" })
    } catch (error) {
        console.log("error deleting post");
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function careerPost(req, res) {
    try {
        const {name,phone}=req.body
        const newDriver=postDriver(name,phone)
        res.status(201).json({ message: 'Driver saved successfully', driver: newDriver });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save driver', message: error.message });
    }
}

export async function getCityData(req, res) {
    try {
        const cityChartData = await getCityCountData()
        res.status(201).json({ message: 'City Data', cityChartData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch religion data', message: error.message });
    }
}
export async function getreligionData(req, res) {
    try {
        const religionChartData = await getReligionChartData()
        res.status(201).json({ message: 'Religion Data', religionChartData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch religion data', message: error.message });
    }
}
export async function getAgeGenderData(req, res) {
    try {
        const ageGenderChartData = await getAgeGenderCountData()
        res.status(201).json({ message: 'Age Gender Data', ageGenderChartData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch age gender data', message: error.message });
    }
}

const redirectUri = "http://localhost:8000/api/imgurcallback"
export async function ImgurLogin(req, res) {
    console.log(redirectUri);
    const authorizationUrl = `https://api.imgur.com/oauth2/authorize?client_id=${IMGUR_CLIENTID}&response_type=token`
    console.log(res.data);
    res.redirect(authorizationUrl);
}

export async function ImgurCallback(req, res) {
    const authorizationCode = req.query.code;
    // Exchange authorization code for access token
    try {
        const response = await axios.post('https://api.imgur.com/oauth2/token', {
            refresh_token: IMGUR_REFRESH_TOKEN,
            client_id: IMGUR_CLIENTID,
            client_secret: IMGUR_CLIENTSECRET,
            grant_type: 'refresh_token'
        });

        const accessToken = response.data.access_token;
        // Use the access token to make authenticated API requests
        console.log('Access token:', accessToken);
        res.send('Authorization successful! Access token received.');
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.response.data);
        res.status(500).send('Failed to exchange authorization code for access token');
    }
}