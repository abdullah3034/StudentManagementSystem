const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentCode: {
        type: String,
        unique: true,
        immutable: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                const trimmed = v.trim();
                return trimmed.length >= 2 && trimmed.length <= 50 && /^[A-Za-z\s]+$/.test(trimmed);
            },
            message: 'First name must be 2-50 characters and contain only alphabets'
        }
    },
    middleName: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v || v.trim() === '') return true; // Optional field
                return /^[A-Za-z\s]+$/.test(v);
            },
            message: 'Middle name must contain only alphabets'
        }
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                const trimmed = v.trim();
                return trimmed.length >= 2 && trimmed.length <= 50 && /^[A-Za-z\s]+$/.test(trimmed);
            },
            message: 'Last name must be 2-50 characters and contain only alphabets'
        }
    },
    birthDate: {
        type: Date,
        required: [true, 'Birth date is required'],
        validate: {
            validator: function (value) {
                return value < new Date();
            },
            message: 'Birth date must be in the past'
        }
    },
    age: {
        type: Number
    },
    addressLine1: {
        type: String,
        required: [true, 'Address Line 1 is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return v.trim().length >= 5;
            },
            message: 'Address Line 1 must be at least 5 characters'
        }
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                const trimmed = v.trim();
                return trimmed.length >= 2 && /^[A-Za-z\s]+$/.test(trimmed);
            },
            message: 'City must be at least 2 characters and contain only alphabets'
        }
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        enum: {
            values: [
                'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
                'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
                'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
                'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
                'Monaragala', 'Ratnapura', 'Kegalle'
            ],
            message: 'District must be selected from the dropdown list'
        }
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Contact number must be exactly 10 digits'
        }
    },
    email: {
        type: String,
        trim: true,
        default: undefined,
        unique: true,
        sparse: true, // Allows multiple null values but enforces uniqueness for non-null values
        validate: {
            validator: function (v) {
                if (!v || v === '' || v.trim() === '') return true; // Optional field
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(v.toLowerCase().trim());
            },
            message: 'Email must be in a valid format'
        },
        set: function (v) {
            // Convert to lowercase and return undefined if empty
            if (!v || v.trim() === '') return undefined;
            return v.toLowerCase().trim();
        }
    }
}, {
    timestamps: true
});

// Auto-generate student code before saving
studentSchema.pre('save', async function () {
    if (!this.studentCode) {
        try {
            // Find the latest student code
            const lastStudent = await this.constructor.findOne({}, {}, { sort: { 'studentCode': -1 } });

            let nextNumber = 1;
            if (lastStudent && lastStudent.studentCode) {
                const lastNumber = parseInt(lastStudent.studentCode.split('_')[1]);
                nextNumber = lastNumber + 1;
            }

            this.studentCode = `STU_${String(nextNumber).padStart(4, '0')}`;
        } catch (error) {
            throw error;
        }
    }

    // Calculate age as of 01/01/2025
    if (this.birthDate) {
        const referenceDate = new Date('2025-01-01');
        const birthDate = new Date(this.birthDate);
        let age = referenceDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
            age--;
        }

        this.age = age;
    }
});

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
    if (this.middleName) {
        return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
});

// Enable virtuals in JSON
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
