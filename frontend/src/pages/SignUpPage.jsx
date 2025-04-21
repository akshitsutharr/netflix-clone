import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader } from "lucide-react";

const SignUpPage = () => {
	const { searchParams } = new URL(document.location);
	const emailValue = searchParams.get("email");

	const [email, setEmail] = useState(emailValue || "");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		const newErrors = {};
		
		if (!email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!username) {
			newErrors.username = "Username is required";
		} else if (username.length < 3) {
			newErrors.username = "Username must be at least 3 characters";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		if (validateForm()) {
			signup({ email, username, password });
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
					<h1 className='text-center text-white text-2xl font-bold mb-4'>Sign Up</h1>

					<form className='space-y-4' onSubmit={handleSignUp}>
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
							<label htmlFor='username' className='text-sm font-medium text-gray-300 block'>
								Username
							</label>
							<input
								type='text'
								className={`w-full px-3 py-2 mt-1 border ${errors.username ? 'border-red-500' : 'border-gray-700'} rounded-md bg-transparent text-white focus:outline-none focus:ring`}
								placeholder='johndoe'
								id='username'
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
									if (errors.username) {
										setErrors({...errors, username: null});
									}
								}}
							/>
							{errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
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
							className='w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 flex items-center justify-center'
							disabled={isSigningUp}
							type="submit"
						>
							{isSigningUp ? (
								<>
									<Loader className="animate-spin mr-2 size-5" /> 
									Signing up...
								</>
							) : "Sign Up"}
						</button>
					</form>
					<div className='text-center text-gray-400'>
						Already a member?{" "}
						<Link to={"/login"} className='text-red-500 hover:underline'>
							Sign in
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
export default SignUpPage;
