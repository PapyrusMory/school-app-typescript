import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Year } from '../types/Year'

export const useNewYearMutation = () =>
  useMutation({
    mutationFn: async (year: Year) =>
      (await apiClient.post<Year>(`api/years/new`, year)).data,
  })

export const useGetYearsQuery = () =>
  useQuery({
    queryKey: ['years'],
    queryFn: async () => (await apiClient.get<[Year]>(`api/years/all`)).data,
  })

export const useDeleteYearMutation = () =>
  useMutation({
    mutationFn: async (yearId: string) =>
      (await apiClient.delete<{ message: string }>(`api/years/${yearId}`)).data,
  })

export const useUpdateYearMutation = () =>
  useMutation({
    mutationFn: async (year: Year) =>
      (
        await apiClient.put<{ year: Year; message: string }>(
          `api/years/${year._id}`,
          year
        )
      ).data,
  })

export const useGetYearDetailsQuery = (yearId: string | undefined) =>
  useQuery({
    queryKey: ['year', yearId],
    queryFn: async () =>
      (await apiClient.get<Year>(`api/years/${yearId}`)).data,
  })
