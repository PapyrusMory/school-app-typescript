import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'

import { UserInfo, User } from '../types/UserInfo'

export const useNewUserMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      isAdmin,
      isEducator,
    }: {
      name: string
      password: string
      isAdmin: boolean
      isEducator: boolean
      email: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/new`, {
          name,
          email,
          password,
          isAdmin,
          isEducator,
        })
      ).data,
  })

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      password,
    }: {
      name: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/login`, {
          name,
          password,
        })
      ).data,
  })

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => (await apiClient.get<[User]>(`api/users/all`)).data,
  })

export const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      (await apiClient.delete<{ message: string }>(`/api/users/${userId}`))
        .data,
  })

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: async (user: {
      _id: string
      name: string
      email: string
      isAdmin: string
      isEducator: string
      password: string
    }) =>
      (
        await apiClient.put<{ user: User; message: string }>(
          `api/users/${user._id}`,
          user
        )
      ).data,
  })

export const useGetUserDetailsQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: async () =>
      (await apiClient.get<User>(`/api/users/${userId}`)).data,
  })
