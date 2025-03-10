const express = require("express");
const {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  addCourseToMyCourses,fetchAllMyCourses
} = require("../../controllers/student-controller/course-controller");
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);
router.post("/add-to-my-courses", addCourseToMyCourses);
router.get("/get/mycourses/:id",fetchAllMyCourses)
module.exports = router;
