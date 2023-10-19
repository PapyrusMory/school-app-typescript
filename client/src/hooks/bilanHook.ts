import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Bilan } from '../types/Bilan'

export const useNewBilanMutation = () =>
  useMutation({
    mutationFn: async (bilan: Bilan) =>
      (await apiClient.post<Bilan>(`api/bilans/new`, bilan)).data,
  })

export const useGetBilansQuery = () =>
  useQuery({
    queryKey: ['Bilans'],
    queryFn: async () => (await apiClient.get<[Bilan]>(`api/bilans/all`)).data,
  })

export const useDeleteBilanMutation = () =>
  useMutation({
    mutationFn: async (bilanId: string) =>
      (await apiClient.delete<{ message: string }>(`api/bilans/${bilanId}`))
        .data,
  })

export const useUpdateBilanMutation = () =>
  useMutation({
    mutationFn: async (bilan: Bilan) =>
      (
        await apiClient.put<{ bilan: Bilan; message: string }>(
          `api/bilans/${bilan._id}`,
          bilan
        )
      ).data,
  })

export const useGetBilanListByUserQuery = () =>
  useQuery({
    queryKey: ['ListByUser'],
    queryFn: async () => (await apiClient.get(`api/bilans/listByUser`)).data,
  })

export const useGetBilanCurrentMonthPreviewQuery = () =>
  useQuery({
    queryKey: ['CurrentMonthPreview'],
    queryFn: async () =>
      (await apiClient.get(`api/bilans/current-month-preview`)).data,
  })

export const useGetBilanByCategoryPreviewQuery = () =>
  useQuery({
    queryKey: ['BilanByCategory'],
    queryFn: async () =>
      (await apiClient.get(`api/bilans/bilan-category`)).data,
  })

export const useGetBilanAverageCategoriesPreviewQuery = () =>
  useQuery({
    queryKey: ['AverageCategories'],
    queryFn: async () =>
      (await apiClient.get(`api/bilans/average-categories`)).data,
  })

export const useGetYearlyBilanQuery = () =>
  useQuery({
    queryKey: ['YearlyBilan'],
    queryFn: async () => (await apiClient.get(`api/bilans/yearly-bilan`)).data,
  })

export const useGetPlotBilanQuery = () =>
  useQuery({
    queryKey: ['PlotBilan'],
    queryFn: async () => (await apiClient.get(`api/bilans/plot-bilans`)).data,
  })
