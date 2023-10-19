import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Student } from '../types/Student'

export const useNewStudentMutation = () =>
  useMutation({
    mutationFn: async (student: Student) =>
      (await apiClient.post<Student>(`api/students/new`, student)).data,
  })

export const useGetStudentsQuery = () =>
  useQuery({
    queryKey: ['Students'],
    queryFn: async () =>
      (await apiClient.get<[Student]>(`api/students/all`)).data,
  })

export const useDeleteStudentMutation = () =>
  useMutation({
    mutationFn: async (studentId: string) =>
      (await apiClient.delete<{ message: string }>(`api/students/${studentId}`))
        .data,
  })

export const useUpdateStudentMutation = () =>
  useMutation({
    mutationFn: async (student: Student) =>
      (
        await apiClient.put<{ student: Student; message: string }>(
          `api/students/${student._id}`,
          student
        )
      ).data,
  })

export const useGetStudentDetailsQuery = (studentId: string | undefined) =>
  useQuery({
    queryKey: ['Student', studentId],
    queryFn: async () =>
      (await apiClient.get<Student>(`api/students/${studentId}`)).data,
  })

export const useGetStudentByClassIdQuery = (classId: string | undefined) =>
  useQuery({
    queryKey: ['students', classId],
    queryFn: async () =>
      await apiClient.get(`api/students/${classId}/students`),
  })

export const useGetStudentSummaryQuery = () =>
  useQuery({
    queryKey: ['StudentSummary'],
    queryFn: async () => (await apiClient.get(`api/students/summary`)).data,
  })
