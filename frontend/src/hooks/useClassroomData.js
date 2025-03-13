import { useState, useEffect } from "react";

export function useClassroom(courseId) {
  const token = localStorage.getItem("token");
  const [classroomData, setClassroomData] = useState({
    className: "",
    notices: [],
    assignments: [],
    buildHistories: [],
    students: [],
    teacherIdeId: "",
    studentIdeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await fetch(
          `http://15.165.155.115:8080/api/classroom/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("강의실 정보 가져오기 실패");

        const data = await response.json();
        const result = data.result;
        setClassroomData({
          className: result.className || "",
          teacherIdeId: result.teacherIdeId || "",
          studentIdeId: result.studentIdeId || "",
          notices: result.noticeList || [],
          assignments: result.assignmentList || [],
          buildHistories: result.buildHistoryList || [],
          students: result.studentList || [],
        });
        console.log("강의실 정보:", result);
        setIsTeacher(result.studentIdeId === null);
        // console.log("isTeacher : ", isTeacher);
      } catch (error) {
        setError(error.message);
        console.error("강의실 정보 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchClassroom();
  }, [courseId, token]);

  return { ...classroomData, loading, error, isTeacher };
}
