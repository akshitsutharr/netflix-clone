import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader } from "lucide-react";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const { login, isLoggingIn } = useAuthStore();

	const validateForm = () => {
		const newErrors = {};
		
		if (!email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = (e) => {
		e.preventDefault();
		if (validateForm()) {
			login({ email, password });
		}
	};

	return (
		<div className='h-screen w-full hero-bg'>
			<header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
				<Link to={"/"}>
					<img src='/netflix-logo.png' alt='logo' className='w-52' />
				</Link>
			</header>

			<div className='flex justify-center items-center mt-20 mx-3'>
				<div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'>
					<h1 className='text-center text-white text-2xl font-bold mb-4'>Login</h1>

					<form className='space-y-4' onSubmit={handleLogin}>
						<div>
							<label htmlFor='email' className='text-sm font-medium text-gray-300 block'>
								Email
							</label>
							<input
								type='email'
								className={`w-full px-3 py-2 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-md bg-transparent text-white focus:outline-none focus:ring`}
								placeholder='you@example.com'
								id='email'
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									if (errors.email) {
										setErrors({...errors, email: null});
									}
								}}
							/>
							{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor='password' className='text-sm font-medium text-gray-300 block'>
								Password
							</label>
							<input
								type='password'
								className={`w-full px-3 py-2 mt-1 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-md bg-transparent text-white focus:outline-none focus:ring`}
								placeholder='••••••••'
								id='password'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									if (errors.password) {
										setErrors({...errors, password: null});
									}
								}}
							/>
							{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
						</div>

						<button
							className='w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700 flex items-center justify-center'
							disabled={isLoggingIn}
							type="submit"
						>
							{isLoggingIn ? (
								<>
									<Loader className="animate-spin mr-2 size-5" /> 
									Logging in...
								</>
							) : "Login"}
						</button>
					</form>
					<div className='text-center text-gray-400'>
						Don't have an account?{" "}
						<Link to={"/signup"} className='text-red-500 hover:underline'>
							Sign Up
						</Link>
					</div>
					
					<div className="text-gray-400 text-xs text-center mt-6">
						Built by <a href="https://github.com/akshitsutharr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Akshit Suthar</a>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
