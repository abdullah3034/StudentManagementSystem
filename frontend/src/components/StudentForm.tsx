import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { studentService } from '../services/api';
import type { Student, StudentFormData } from '../types/Student';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
];

const StudentForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<StudentFormData>({
        firstName: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        contactNumber: '',
        email: '',
    });

    const [student, setStudent] = useState<Student | null>(null);
    const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isEditMode && id) {
            loadStudent(id);
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (formData.birthDate) {
            calculateAge(formData.birthDate);
        }
    }, [formData.birthDate]);

    const loadStudent = async (studentId: string) => {
        try {
            const data = await studentService.getById(studentId);
            setStudent(data);

            // Convert date to YYYY-MM-DD format for input
            const birthDate = new Date(data.birthDate);
            const formattedDate = birthDate.toISOString().split('T')[0];

            setFormData({
                firstName: data.firstName,
                middleName: data.middleName || '',
                lastName: data.lastName,
                birthDate: formattedDate,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2 || '',
                city: data.city,
                district: data.district,
                contactNumber: data.contactNumber,
                email: data.email || '',
            });
        } catch (err: any) {
            alert('Failed to load student: ' + err.message);
            navigate('/');
        }
    };

    const calculateAge = (birthDateString: string) => {
        const birthDate = new Date(birthDateString);
        const referenceDate = new Date('2025-01-01');

        let age = referenceDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
            age--;
        }

        setCalculatedAge(age);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // First Name validation: required, 2-50 characters, alphabets only
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else {
            const firstNameTrimmed = formData.firstName.trim();
            if (firstNameTrimmed.length < 2 || firstNameTrimmed.length > 50) {
                newErrors.firstName = 'First name must be between 2 and 50 characters';
            } else if (!/^[A-Za-z\s]+$/.test(firstNameTrimmed)) {
                newErrors.firstName = 'First name must contain only alphabets';
            }
        }

        // Last Name validation: required, 2-50 characters, alphabets only
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else {
            const lastNameTrimmed = formData.lastName.trim();
            if (lastNameTrimmed.length < 2 || lastNameTrimmed.length > 50) {
                newErrors.lastName = 'Last name must be between 2 and 50 characters';
            } else if (!/^[A-Za-z\s]+$/.test(lastNameTrimmed)) {
                newErrors.lastName = 'Last name must contain only alphabets';
            }
        }

        // Middle Name validation: if provided, alphabets only
        if (formData.middleName && formData.middleName.trim() !== '') {
            if (!/^[A-Za-z\s]+$/.test(formData.middleName.trim())) {
                newErrors.middleName = 'Middle name must contain only alphabets';
            }
        }

        // Email validation: if provided, valid email format
        if (formData.email && formData.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Birth Date validation: required, must be in the past
        if (!formData.birthDate) {
            newErrors.birthDate = 'Birth date is required';
        } else {
            const birthDate = new Date(formData.birthDate);
            if (birthDate >= new Date()) {
                newErrors.birthDate = 'Birth date must be in the past';
            }
        }

        // Address Line 1 validation: required, minimum 5 characters
        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address Line 1 is required';
        } else if (formData.addressLine1.trim().length < 5) {
            newErrors.addressLine1 = 'Address Line 1 must be at least 5 characters';
        }

        // City validation: required, alphabets only, minimum 2 characters
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        } else {
            const cityTrimmed = formData.city.trim();
            if (cityTrimmed.length < 2) {
                newErrors.city = 'City must be at least 2 characters';
            } else if (!/^[A-Za-z\s]+$/.test(cityTrimmed)) {
                newErrors.city = 'City must contain only alphabets';
            }
        }

        // District validation: required, must be from dropdown
        if (!formData.district) {
            newErrors.district = 'District is required';
        } else if (!DISTRICTS.includes(formData.district)) {
            newErrors.district = 'Please select a valid district from the dropdown';
        }

        // Contact Number validation: required, exactly 10 digits
        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let newValue = value;

        // For contact number, only allow digits
        if (name === 'contactNumber') {
            newValue = value.replace(/\D/g, '');
        }
        // For name fields (firstName, lastName, middleName), only allow alphabets and spaces
        else if (name === 'firstName' || name === 'lastName' || name === 'middleName') {
            // Allow only alphabets and spaces
            newValue = value.replace(/[^A-Za-z\s]/g, '');
        }
        // For city, only allow alphabets and spaces
        else if (name === 'city') {
            newValue = value.replace(/[^A-Za-z\s]/g, '');
        }

        // Update form data state
        setFormData(prevFormData => {
            const updated = {
                ...prevFormData,
                [name]: newValue
            };
            return updated;
        });

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            if (isEditMode && id) {
                await studentService.update(id, formData);
                alert('Student updated successfully!');
            } else {
                await studentService.create(formData);
                alert('Student created successfully!');
            }
            navigate('/');
        } catch (err: any) {
            // Handle validation errors from backend
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const formattedErrors: { [key: string]: string } = {};

                Object.keys(backendErrors).forEach(key => {
                    formattedErrors[key] = backendErrors[key].message || backendErrors[key];
                });

                setErrors(formattedErrors);

                // Show specific alert for duplicate email
                if (formattedErrors.email) {
                    alert(formattedErrors.email);
                } else if (err.response?.data?.message) {
                    alert(err.response.data.message);
                } else {
                    alert('Please fix the validation errors and try again.');
                }
            } else if (err.response?.data?.message) {
                // Show the error message from backend
                alert(err.response.data.message);
            } else {
                alert('Failed to save student: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDateDisplay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Breadcrumb */}
            <div className="mb-4">
                <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-400">{isEditMode ? 'Edit Student' : 'Add Student'}</span>
                </nav>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/40">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        {isEditMode ? (
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit Student' : 'Add New Student'}
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 ml-9 md:ml-11">
                        {isEditMode ? 'Update student information' : 'Fill in the details to add a new student'}
                    </p>
                </div>

                {/* Student Code (Read-Only in Edit Mode) */}
                {isEditMode && student && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student Code (Auto-generated)
                        </label>
                        <div className="text-2xl font-bold text-purple-600">
                            {student.studentCode}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Name Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName || ''}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.middleName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter middle name"
                                />
                                {errors.middleName && <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Birth Date & Age */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Date of Birth & Age
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Birth Date (DD/MM/YYYY) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.birthDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                                {formData.birthDate && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Display: {formatDateDisplay(formData.birthDate)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age (as of 01/01/2025)
                                </label>
                                <div className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold flex items-center h-[42px]">
                                    {calculatedAge !== null ? `${calculatedAge} years` : '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Address Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    maxLength={200}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter address line 1"
                                />
                                {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2 || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                    placeholder="Enter address line 2 (optional)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        maxLength={100}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter city"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.district ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select District</option>
                                        {DISTRICTS.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number (10 digits) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0771234567"
                                />
                                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                                <p className="text-xs text-gray-500 mt-1">Enter 10 digits only</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="student@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                <p className="text-xs text-gray-500 mt-1"> Enter a valid email address</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : isEditMode ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update Student
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Student
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full md:w-auto px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
