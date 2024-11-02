import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js";
import { addLectures, createCourse,deleteLecture, deleteCourse, getAllStats} from "../controllers/admin.js";
const router = express.Router();

router.post("/course/new",isAuth,isAdmin,uploadFiles,createCourse);

router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);

router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

router.delete("/course/:id", isAuth, isAdmin, deleteCourse);

router.get("/stats", isAuth, isAdmin, getAllStats);
export default router;