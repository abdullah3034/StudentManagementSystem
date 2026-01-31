const Student = require('../models/Student');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        // Clean up email field - set to undefined if empty string
        if (req.body.email !== undefined && (!req.body.email || req.body.email.trim() === '')) {
            req.body.email = undefined;
        } else if (req.body.email) {
            req.body.email = req.body.email.trim();
        }

        // Check for duplicate student code (shouldn't happen as it's auto-generated, but just in case)
        if (req.body.studentCode) {
            const existingStudent = await Student.findOne({ studentCode: req.body.studentCode });
            if (existingStudent) {
                return res.status(400).json({ 
                    message: 'Student code already exists',
                    errors: { studentCode: { message: 'This student code is already in use' } }
                });
            }
        }

        // Check for duplicate email if provided
        if (req.body.email) {
            const existingStudent = await Student.findOne({ email: req.body.email.toLowerCase() });
            if (existingStudent) {
                return res.status(400).json({ 
                    message: 'Email already exists',
                    errors: { email: { message: 'This email is already registered' } }
                });
            }
        }

        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        if (error.name === 'ValidationError') {
            const formattedErrors = {};
            Object.keys(error.errors).forEach(key => {
                formattedErrors[key] = { message: error.errors[key].message };
            });
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: formattedErrors 
            });
        }
        if (error.code === 11000) {
            // Duplicate key error (MongoDB)
            const field = Object.keys(error.keyPattern)[0];
            const fieldName = field === 'email' ? 'email' : 'studentCode';
            return res.status(400).json({ 
                message: `${fieldName === 'email' ? 'Email' : 'Student code'} already exists`,
                errors: { [fieldName]: { message: `This ${fieldName} is already in use` } }
            });
        }
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all students with optional search
exports.getAllStudents = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { studentCode: { $regex: search, $options: 'i' } },
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } },
                    { district: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const students = await Student.find(query).sort({ studentCode: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        // Prevent studentCode modification
        delete req.body.studentCode;

        // Clean up email field - set to undefined if empty string
        if (req.body.email !== undefined && (!req.body.email || req.body.email.trim() === '')) {
            req.body.email = undefined;
        } else if (req.body.email) {
            req.body.email = req.body.email.trim();
        }

        // Check for duplicate email if provided and different from current
        if (req.body.email) {
            const existingStudent = await Student.findOne({ 
                email: req.body.email.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingStudent) {
                return res.status(400).json({ 
                    message: 'Email already exists',
                    errors: { email: { message: 'This email is already registered' } }
                });
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Recalculate age if birthDate changed
        if (req.body.birthDate) {
            await student.save();
        }

        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        if (error.name === 'ValidationError') {
            const formattedErrors = {};
            Object.keys(error.errors).forEach(key => {
                formattedErrors[key] = { message: error.errors[key].message };
            });
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: formattedErrors 
            });
        }
        if (error.code === 11000) {
            // Duplicate key error (MongoDB)
            const field = Object.keys(error.keyPattern)[0];
            const fieldName = field === 'email' ? 'email' : 'studentCode';
            return res.status(400).json({ 
                message: `${fieldName === 'email' ? 'Email' : 'Student code'} already exists`,
                errors: { [fieldName]: { message: `This ${fieldName} is already in use` } }
            });
        }
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
