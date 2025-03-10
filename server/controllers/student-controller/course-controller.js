const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

   

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      
      case "title-atoz":
        sortParam.title = 1;

        break;
      case "title-ztoa":
        sortParam.title = -1;

        break;

      default:
        sortParam.title = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

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

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
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




const addCourseToMyCourses = async (req, res) => {
  try {
    const { course, studentId } = req.body;
    
    let studentCourses = await StudentCourses.findOne({ userId:studentId});

    if (studentCourses) {
      // Check if the course is already in the student's list of courses
      const courseExists = studentCourses.courses.some(
        (someCourse) => someCourse.courseId === course._id
      );

      if (!courseExists) {
        // Add the course to the array if it doesn't exist
        studentCourses.courses.push({
          courseId: course._id,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.image,
        });
        await studentCourses.save();
      }
    } else {
      // Create a new entry for the student if none exists
      studentCourses = new StudentCourses({
        userId:studentId,
        courses: [
          {
            courseId: course._id,
            title: course.title,
            instructorId: course.instructorId,
            instructorName: course.instructorName,
            dateOfPurchase: new Date(),
            courseImage: course.image,
          },
        ],
      });
      await studentCourses.save();
    }

    await Course.findByIdAndUpdate(course._id, {
      $addToSet: {
        students: {
          studentId,
          studentName: req.body.studentname,
          studentEmail: req.body.studentemail,
          paidAmount:  "0",
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course added to My Courses",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const fetchAllMyCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student's courses
    const studentCourses = await StudentCourses.findOne({ userId: studentId }).lean();

    if (!studentCourses || studentCourses.courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses found in My Courses",
        courses: [],
      });
    }

    // Extract course IDs from the studentCourses
    const courseIds = studentCourses.courses.map((course) => course.courseId);

    // Fetch course details for each courseId
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses!",
    });
  }
};


module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  addCourseToMyCourses,
  fetchAllMyCourses
};
