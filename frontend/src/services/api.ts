import axios from 'axios';
import type { Student, StudentFormData } from '../types/Student';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const studentService = {
    // Get all students with optional search
    getAll: async (search?: string): Promise<Student[]> => {
        const params = search ? { search } : {};
        const response = await api.get<Student[]>('/students', { params });
        return response.data;
    },

    // Get a single student by ID
    getById: async (id: string): Promise<Student> => {
        const response = await api.get<Student>(`/students/${id}`);
        return response.data;
    },

    // Create a new student
    create: async (data: StudentFormData): Promise<Student> => {
        const response = await api.post<Student>('/students', data);
        return response.data;
    },

    // Update a student
    update: async (id: string, data: StudentFormData): Promise<Student> => {
        const response = await api.put<Student>(`/students/${id}`, data);
        return response.data;
    },

    // Delete a student
    delete: async (id: string): Promise<void> => {
        await api.delete(`/students/${id}`);
    },
};
