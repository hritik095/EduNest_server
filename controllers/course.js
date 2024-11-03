import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";

export const getAllCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find();
    res.json({ courses });
});

export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    res.json({ course });
});

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.subscription.includes(req.params.id)) {
        return res.json({ lectures });
    }

    return res.status(400).json({ message: "You have not subscribed to this course" });
});

export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.subscription.includes(lecture.course)) {
        return res.json({ lecture });
    }

    return res.status(400).json({ message: "You have not subscribed to this course" });
});

export const getMyCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ _id: { $in: req.user.subscription } });
    res.json({ courses });
});

// New subscription method without payment
export const subscribeToCourse = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (user.subscription.includes(course._id)) {
        return res.status(400).json({ message: "You are already subscribed to this course" });
    }

    user.subscription.push(course._id);
    await Progress.create({
        course: course._id,
        completedLectures: [],
        user: req.user._id,
    });

    await user.save();

    res.status(200).json({ message: "Course subscribed successfully" });
});

export const addProgress = TryCatch(async (req, res) => {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });
  
    const { lectureId } = req.query;
  
    if (progress.completedLectures.includes(lectureId)) {
      return res.json({
        message: "Progress recorded",
      });
    }
  
    progress.completedLectures.push(lectureId);
  
    await progress.save();
  
    res.status(201).json({
      message: "new Progress added",
    });
  });

  export const getYourProgress = TryCatch(async (req, res) => {
    const progress = await Progress.find({
      user: req.user._id,
      course: req.query.course,
    });
  
    if (!progress) return res.status(404).json({ message: "null" });
  
    const allLectures = (await Lecture.find({ course: req.query.course })).length;
  
    const completedLectures = progress[0].completedLectures.length;
  
    const courseProgressPercentage = (completedLectures * 100) / allLectures;
  
    res.json({
      courseProgressPercentage,
      completedLectures,
      allLectures,
      progress,
    });
  });
  