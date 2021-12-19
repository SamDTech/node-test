import { Router } from "express";

import { deleteUser, updateProfile, userPhotoUpload } from "../controllers/userController";
import { requireSignin } from "../middlewares/auth.middleware";
const router = Router();

// middleware to get the current user
router.use(requireSignin);

router.post(
  "/uploadAvatar",
 userPhotoUpload
);


router.patch("/updateProfile", updateProfile);

// delete user
 router.delete("/deleteUser", deleteUser);



export { router as userRouter };
