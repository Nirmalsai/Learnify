import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLecture");

  return (
    <div className="flex flex-col h-screen bg-[#111113] text-white">
      {showConfetti && <Confetti />}
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1e] border-b border-gray-700 shadow-md">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-white hover:bg-gray-700 focus:ring focus:ring-gray-600"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to My Courses</span>
          </Button>
          <h1 className="text-lg font-semibold hidden md:block text-gray-200 truncate">
            {studentCurrentCourseProgress?.courseDetails?.title || "Course Title"}
          </h1>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="text-white hover:bg-gray-700 focus:ring focus:ring-gray-600"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </header>
  
      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <section
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-1000`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-[#1b1b1e]">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              {currentLecture?.title || "Lecture Title"}
            </h2>
          </div>
        </section>
  
        {/* Sidebar */}
        <aside
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1b1b1e] border-l border-gray-700 shadow-lg transform ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-1000`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 bg-[#2a2a2e] w-full h-14">
              <TabsTrigger
                value="content"
                className="text-sm text-white font-medium hover:bg-gray-600"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-sm text-white font-medium hover:bg-gray-600"
              >
                Overview
              </TabsTrigger>
            </TabsList>
  
            {/* Content Tab */}
            <TabsContent value="content" className="h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        key={item._id}
                        onClick={() => setCurrentLecture(item)}
                        className="flex items-center space-x-2 text-sm text-gray-300 font-medium cursor-pointer hover:text-white"
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-5 w-5 text-gray-500" />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
  
            {/* Overview Tab */}
            <TabsContent value="overview" className="h-full overflow-hidden">
              <ScrollArea className="h-full p-4">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                  About this Course
                </h2>
                <p className="text-gray-400 text-sm">
                  {studentCurrentCourseProgress?.courseDetails?.description ||
                    "This course provides a comprehensive understanding of the topic. Enjoy & dive into the details and achieve your learning goals!"}
                </p>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>
      </main>
  
      {/* Locked Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-[#1b1b1e] text-gray-100 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Access Restricted
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Please purchase this course to unlock its content.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  
      {/* Course Complete Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px] bg-[#1b1b1e] text-gray-100 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              🎉 Congratulations!
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">
                You’ve successfully completed the course.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate("/student-courses")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Back to My Courses
                </Button>
                <Button
                  onClick={handleRewatchCourse}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                >
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
  
}

export default StudentViewCourseProgressPage;  