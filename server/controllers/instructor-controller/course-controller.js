const Course = require("../../models/Course");
const StudentCourses=require("../../models/StudentCourses")
const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});
    console.log("hellome");
    console.log(coursesList);
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteCourseByID = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find the course to be deleted
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Step 2: Iterate over the students enrolled in the course
    for (const element of course.students) {
      console.log(element.studentId);
      
      // Use `findOne` if you're expecting a single document, or iterate if multiple are returned
      const studentDoc = await StudentCourses.findOne({ userId: element.studentId });
    
      if (studentDoc) {
        console.log("Found student document:", studentDoc);
        console.log("Original courses:", studentDoc.courses);
    
        // Filter out the course from the student's courses array
        studentDoc.courses = studentDoc.courses.filter((ele) => ele.courseId.toString() !== id);
    
        console.log("Updated courses:", studentDoc.courses);
    
        // Save the updated document
        await studentDoc.save();
      } else {
        console.warn(`StudentCourses entry not found for userId: ${element.studentId}`);
      }
    }
    

    // Step 3: Delete the course
    const deletedCourse = await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      deletedCourse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course",
      error: error.message,
    });
  }
};


module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  deleteCourseByID,
};
