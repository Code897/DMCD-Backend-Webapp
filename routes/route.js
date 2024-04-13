import { Router } from "express";
const router = Router();
import Auth, { localVariables, verifyUser } from "../middleware/auth.js";
import * as controller from '../controllers/appController.js'
import { registerMail } from "../controllers/mailer.js";
import { imageUpload } from "../middleware/imageUploader.js";

router.route('/signup').post((controller.signUp))
router.route('/registermail').post((registerMail))
router.route('/authenticate').post((controller.authenticateUser))
router.route('/signin').post((controller.signIn))

router.route('/tokenVerify').get((controller.tokenCheck))


router.route('/user/:userid').get((controller.getUser))
router.route('/generateOTP').post(localVariables, (controller.generateOTP))
router.route('/verifyOTP').post((controller.verifyOTP))

router.route('/gethomedata').get((controller.homeDataGet));
router.route('/posthomedata').post(imageUpload, (controller.homeDataPost));


router.route('/postblog').post(imageUpload, (controller.blogPost))
router.route('/fetchallblogs').get((controller.blogFetchAll))
router.route('/fetchlatestblogs').get((controller.blogFetchLatest))
router.route('/fetchblog/:blogid').get((controller.blogfetch))
router.route('/deletepost').delete((controller.blogdelete))

router.route('/careerpost').post((controller.careerPost))
router.route('/getreligionChartData').get((controller.getreligionData))
router.route('/getCityChartData').get((controller.getCityData))
router.route('/getAgeChartData').get((controller.getAgeGenderData))

router.route('/imgurlogin').get(controller.ImgurLogin)
router.route('/imgurcallback').get(controller.ImgurCallback)

router.route('/updateuser/:userid').put(Auth, controller.updateUser)
router.route('/resetPassword').put(verifyUser, (controller.resetPassword))

export default router;