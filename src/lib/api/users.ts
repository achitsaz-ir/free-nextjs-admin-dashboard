// lib/api/users.ts - بروزرسانی
import { apiClient } from './client';
import { User, CreateUserRequest, UpdateUserRequest, ManageUserRolesRequest } from '@/types';

export const usersApi = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nationalId?: string;
  }): Promise<User> {
    const response = await apiClient.patch('/users/profile', data);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<{ user: User; tempPassword?: string }> {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async manageUserRoles(id: string, data: ManageUserRolesRequest): Promise<User> {
    const response = await apiClient.patch(`/users/${id}/roles`, data);
    return response.data;
  },

  async resetUserPassword(id: string): Promise<{ message: string; tempPassword: string }> {
    const response = await apiClient.patch(`/users/${id}/reset-password`);
    return response.data;
  },

  async approveUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.patch(`/users/approve/${id}`);
    return response.data;
  },

  async getPendingUsers(): Promise<User[]> {
    const response = await apiClient.get('/users/pending-approval');
    return response.data;
  },
};
