import { useState, useEffect } from "react";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // const response = await fetch(`/classrooms/${id}/students`);
      // const data = await response.json();

      // mock data
      const data = ["송정현", "이준형", "현재환"];

      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError("학생 목록을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  return { students, loading, error };
}
