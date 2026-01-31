import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '../services/api';
import type { Student } from '../types/Student';

const StudentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadStudent(id);
        }
    }, [id]);

    const loadStudent = async (studentId: string) => {
        try {
            setLoading(true);
            const data = await studentService.getById(studentId);
            setStudent(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load student');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (student && window.confirm(`Are you sure you want to delete student ${student.studentCode}?`)) {
            try {
                await studentService.delete(student._id!);
                alert('Student deleted successfully!');
                navigate('/');
            } catch (err: any) {
                alert('Failed to delete student: ' + err.message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/40 text-center">
                <p className="text-red-600 text-xl mb-4">⚠️ {error || 'Student not found'}</p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                    ← Back to List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 space-y-6">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/40">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 md:mb-2">
                            Student Details
                        </h1>
                        <p className="text-gray-600">Complete information for {student.fullName}</p>
                    </div>
                    <div className="md:text-right">
                        <div className="text-xs text-gray-500">Student Code</div>
                        <div className="text-xl md:text-2xl font-bold text-purple-600">{student.studentCode}</div>
                    </div>
                </div>
            </div>

            {/* Student Information */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/40">
                {/* Name Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Name Information
                    </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">First Name</div>
                        <div className="text-lg font-semibold text-gray-800">{student.firstName}</div>
                    </div>
                    {student.middleName && (
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Middle Name</div>
                            <div className="text-lg font-semibold text-gray-800">{student.middleName}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Last Name</div>
                        <div className="text-lg font-semibold text-gray-800">{student.lastName}</div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="text-sm text-gray-500 mb-1">Full Name</div>
                        <div className="text-xl font-bold text-purple-600">{student.fullName}</div>
                    </div>
                </div>

                {/* Birth Date & Age Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date of Birth & Age
                    </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Birth Date</div>
                        <div className="text-lg font-semibold text-gray-800">{formatDate(student.birthDate)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Age (as of 01/01/2025)</div>
                        <div className="text-lg font-semibold text-gray-800">{student.age} years</div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Address Line 1</div>
                        <div className="text-lg font-semibold text-gray-800">{student.addressLine1}</div>
                    </div>
                    {student.addressLine2 && (
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Address Line 2</div>
                            <div className="text-lg font-semibold text-gray-800">{student.addressLine2}</div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">City</div>
                            <div className="text-lg font-semibold text-gray-800">{student.city}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">District</div>
                            <div className="text-lg font-semibold text-gray-800">{student.district}</div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Contact Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Contact Number</div>
                        <div className="text-lg font-semibold text-gray-800">{student.contactNumber}</div>
                    </div>
                    {student.email && (
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Email Address</div>
                            <div className="text-lg font-semibold text-gray-800">{student.email}</div>
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                {(student.createdAt || student.updatedAt) && (
                    <>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Record Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {student.createdAt && (
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Created At</div>
                                    <div className="text-sm text-gray-700">
                                        {new Date(student.createdAt).toLocaleString('en-GB')}
                                    </div>
                                </div>
                            )}
                            {student.updatedAt && (
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                                    <div className="text-sm text-gray-700">
                                        {new Date(student.updatedAt).toLocaleString('en-GB')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <Link
                    to="/"
                    className="w-full md:flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to List
                </Link>
                <Link
                    to={`/edit/${student._id}`}
                    className="w-full md:flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Student
                </Link>
                <button
                    onClick={handleDelete}
                    className="w-full md:flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Student
                </button>
            </div>
        </div>
    );
};

export default StudentDetails;
