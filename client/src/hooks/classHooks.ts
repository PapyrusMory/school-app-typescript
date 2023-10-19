import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Class } from '../types/Class'

export const useNewClassMutation = () =>
  useMutation({
    mutationFn: async (classs: Class) =>
      (await apiClient.post<Class>(`api/classes/new`, classs)).data,
  })

export const useGetClassesQuery = () =>
  useQuery({
    queryKey: ['Classs'],
    queryFn: async () => (await apiClient.get<[Class]>(`api/classes/all`)).data,
  })

export const useDeleteClassMutation = () =>
  useMutation({
    mutationFn: async (classId: string) =>
      (await apiClient.delete<{ message: string }>(`api/classes/${classId}`))
        .data,
  })

export const useUpdateClassMutation = () =>
  useMutation({
    mutationFn: async (classs: Class) =>
      (
        await apiClient.put<{ classs: Class; message: string }>(
          `api/classes/${classs._id}`,
          classs
        )
      ).data,
  })

export const useGetClassDetailsQuery = (classId: string | undefined) =>
  useQuery({
    queryKey: ['Class', classId],
    queryFn: async () =>
      (await apiClient.get<Class>(`api/classes/${classId}`)).data,
  })

export const useGetClassByYearIdQuery = (yearId: string | undefined) =>
  useQuery({
    queryKey: ['classes', yearId],
    queryFn: async () => await apiClient.get(`api/classes/${yearId}/classes`),
  })
