import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../services/api';
import type { Student } from '../types/Student';

const StudentList = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadStudents();
    }, [search]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAll(search || undefined);
            setStudents(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, studentCode: string) => {
        if (window.confirm(`Are you sure you want to delete student ${studentCode}?`)) {
            try {
                await studentService.delete(id);
                loadStudents();
            } catch (err: any) {
                alert('Failed to delete student: ' + err.message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/40">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 md:mb-2">
                            Student Directory
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">Manage and view all student records</p>
                    </div>
                    <Link
                        to="/add"
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/40">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name, code, city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none text-gray-700 text-sm md:text-base"
                    />
                    <svg
                        className="absolute left-4 top-3.5 h-5 w-5 text-purple-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Students List - Table (Desktop) & Cards (Mobile) */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/40">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        <p className="text-xl">⚠️ {error}</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-500 text-lg mb-4">No students found</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Student Code</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Full Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Birth Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Age</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">City</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">District</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr
                                            key={student._id}
                                            className="hover:bg-purple-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/details/${student._id}`)}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-purple-600">
                                                {student.studentCode}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {student.fullName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(student.birthDate)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.age} years
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.city}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.district}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.contactNumber}
                                            </td>
                                            <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/details/${student._id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit/${student._id}`)}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student._id!, student.studentCode!)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className="p-4 hover:bg-purple-50 transition-colors"
                                    onClick={() => navigate(`/details/${student._id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-xs font-bold text-purple-600 mb-1">{student.studentCode}</p>
                                            <h3 className="text-lg font-bold text-gray-900">{student.fullName}</h3>
                                        </div>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => navigate(`/edit/${student._id}`)}
                                                className="p-2 text-green-600 bg-green-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student._id!, student.studentCode!)}
                                                className="p-2 text-red-600 bg-red-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                        <div>
                                            <p className="text-gray-500 text-xs">Birth Date</p>
                                            <p className="font-medium">{formatDate(student.birthDate)} ({student.age}y)</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Location</p>
                                            <p className="font-medium truncate">{student.city}, {student.district}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-500 text-xs">Contact</p>
                                            <p className="font-medium">{student.contactNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Total Count */}
            {students.length > 0 && (
                <div className="text-center text-white/90 text-sm">
                    Showing {students.length} student{students.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default StudentList;
