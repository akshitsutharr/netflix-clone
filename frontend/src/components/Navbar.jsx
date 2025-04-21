import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, Search, User, X } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
import toast from "react-hot-toast";

const Navbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { user, logout, isLoggingOut } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();
	const { setContentType } = useContentStore();

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			toast.error("Logout failed. Please try again.");
		}
	};

	return (
		<header 
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				isScrolled ? 'bg-black shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
			}`}
		>
			<div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3'>
				<div className='flex items-center gap-8'>
					<Link to='/' className="flex items-center">
						<img src='/netflix-logo.png' alt='Netflix' className='w-24 sm:w-32' />
					</Link>

					{/* Desktop navbar items */}
					{user && (
						<div className='hidden md:flex gap-6 items-center'>
							<Link 
								to='/' 
								className={`text-white hover:text-gray-300 transition-colors duration-300 text-sm font-medium ${
									location.pathname === '/' && 'font-bold text-white'
								}`} 
								onClick={() => setContentType("movie")}
							>
								Movies
							</Link>
							<Link 
								to='/?content=tv' 
								className={`text-white hover:text-gray-300 transition-colors duration-300 text-sm font-medium ${
									location.search.includes('content=tv') && 'font-bold text-white'
								}`} 
								onClick={() => setContentType("tv")}
							>
								TV Shows
							</Link>
							<Link 
								to='/history' 
								className={`text-white hover:text-gray-300 transition-colors duration-300 text-sm font-medium ${
									location.pathname === '/history' && 'font-bold text-white'
								}`}
							>
								Search History
							</Link>
						</div>
					)}
				</div>

				<div className='flex items-center gap-5'>
					{user && (
						<>
							<Link 
								to="/search" 
								className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
								aria-label="Search"
							>
								<Search className='size-5' />
							</Link>
							{user.image ? (
								<div className="relative group">
									<img 
										src={user.image} 
										alt='Profile' 
										className='h-9 w-9 rounded-full border-2 border-transparent object-cover group-hover:border-red-600 transition-all duration-300' 
									/>
									<div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
										<div className="p-3 border-b border-gray-800">
											<p className="text-white font-medium">{user.username}</p>
											<p className="text-gray-400 text-xs truncate">{user.email}</p>
										</div>
										<button 
											onClick={handleLogout} 
											disabled={isLoggingOut}
											className="flex items-center w-full p-3 text-white hover:bg-gray-800 transition-colors duration-300"
										>
											<LogOut className='size-4 mr-2' />
											<span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
										</button>
									</div>
								</div>
							) : (
								<User className='size-9 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300' />
							)}
						</>
					)}
					<button 
						className='md:hidden text-white p-2 hover:bg-gray-800 rounded-full transition-colors duration-300'
						onClick={toggleMobileMenu}
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMobileMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
					</button>
				</div>
			</div>

			{/* Mobile menu overlay */}
			{isMobileMenuOpen && (
				<div className='md:hidden fixed inset-0 z-40 bg-black/95'>
					<div className='flex flex-col h-full pt-20 px-6'>
						{user ? (
							<>
								<Link 
									to="/" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={() => {
										setContentType("movie");
										toggleMobileMenu();
									}}
								>
									Movies
								</Link>
								<Link 
									to="/?content=tv" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={() => {
										setContentType("tv");
										toggleMobileMenu();
									}}
								>
									TV Shows
								</Link>
								<Link 
									to="/history" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={toggleMobileMenu}
								>
									Search History
								</Link>
								<Link 
									to="/search" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={toggleMobileMenu}
								>
									Search
								</Link>
								<button
									onClick={() => {
										handleLogout();
										toggleMobileMenu();
									}}
									className='mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center transition-colors duration-300'
								>
									<LogOut className='size-5 mr-2' />
									Log Out
								</button>
							</>
						) : (
							<>
								<Link 
									to="/login" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={toggleMobileMenu}
								>
									Log In
								</Link>
								<Link 
									to="/signup" 
									className='py-4 text-lg font-medium border-b border-gray-800'
									onClick={toggleMobileMenu}
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
};
export default Navbar;
