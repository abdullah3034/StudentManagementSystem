import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';
import './style.css';

function Navbar() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAddPage = location.pathname === '/add';
    const isEditPage = location.pathname.startsWith('/edit/');
    const isDetailsPage = location.pathname.startsWith('/details/');

    // Get page title for breadcrumb
    const getPageTitle = () => {
        if (isHomePage) return 'Dashboard';
        if (isAddPage) return 'Add Student';
        if (isEditPage) return 'Edit Student';
        if (isDetailsPage) return 'Student Details';
        return '';
    };

    return (
        <nav className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-xl border-b border-purple-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-20">
                    {/* Logo and Title Section */}
                    <Link to="/" className="flex items-center gap-4 group flex-1">
                        {/* Logo Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm group-hover:bg-white/30 transition-all"></div>
                            <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all transform group-hover:scale-110 shadow-lg border border-white/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>

                        {/* Title and Breadcrumb */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors leading-tight">
                                Student Management System
                            </h1>
                            {!isHomePage ? (
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Link
                                        to="/"
                                        className="text-sm text-white/80 hover:text-white transition-colors font-medium flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Home
                                    </Link>
                                    <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-sm text-white font-semibold">{getPageTitle()}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-white/90 font-medium mt-1.5 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Manage your student records efficiently
                                </p>
                            )}
                        </div>
                    </Link>

                    {/* Right Side - System Info & Profile */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* System Status */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-white tracking-wider">SYSTEM ACTIVE</span>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 pl-6 border-l border-white/20">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">Admin</p>
                                <p className="text-[10px] text-purple-100 font-medium mt-1 uppercase tracking-tight">Super User</p>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/30 transition-all"></div>
                                <div className="relative h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all transform group-hover:scale-105 shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Profile Icon Only */}
                    <div className="md:hidden flex items-center">
                        <div className="h-9 w-9 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<StudentList />} />
                        <Route path="/add" element={<StudentForm />} />
                        <Route path="/edit/:id" element={<StudentForm />} />
                        <Route path="/details/:id" element={<StudentDetails />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
