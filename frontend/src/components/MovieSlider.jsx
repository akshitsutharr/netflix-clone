import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Loader, Star } from "lucide-react";
import toast from "react-hot-toast";

const MovieSlider = ({ category }) => {
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]);
	const [showArrows, setShowArrows] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hoveredItem, setHoveredItem] = useState(null);

	const sliderRef = useRef(null);

	const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

	useEffect(() => {
		const getContent = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await axios.get(`/api/v1/${contentType}/${category}`);
				if (res.data && res.data.content) {
					// Filter out items without backdrop_path
					const validContent = res.data.content.filter(item => item.backdrop_path);
					setContent(validContent);
				} else {
					setContent([]);
				}
			} catch (error) {
				console.error(`Error fetching ${category}:`, error);
				setError(error.message || `Failed to load ${formattedCategoryName}`);
				toast.error(`Failed to load ${formattedCategoryName} ${formattedContentType}`);
			} finally {
				setLoading(false);
			}
		};

		getContent();
	}, [contentType, category, formattedCategoryName, formattedContentType]);

	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	
	const scrollRight = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};

	return (
		<div
			className='text-white relative px-4 md:px-10'
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => {
				setShowArrows(false);
				setHoveredItem(null);
			}}
		>
			<h2 className='mb-3 text-xl md:text-2xl font-bold text-gray-100'>
				{formattedCategoryName} {formattedContentType}
			</h2>

			{loading ? (
				<div className="flex justify-center py-8">
					<Loader className="animate-spin size-10 text-red-600" />
				</div>
			) : error ? (
				<div className="py-8 text-center text-red-400">{error}</div>
			) : content.length === 0 ? (
				<div className="py-8 text-center text-gray-400">No content available</div>
			) : (
				<div className='flex space-x-4 overflow-x-auto scrollbar-hide pb-6' ref={sliderRef}>
					{content.map((item) => (
						<Link 
							to={`/watch/${item.id}`}
							className='min-w-[220px] md:min-w-[280px] relative group'
							key={item.id}
							onMouseEnter={() => setHoveredItem(item.id)}
							onMouseLeave={() => setHoveredItem(null)}
						>
							<div className='rounded-lg overflow-hidden shadow-lg relative'>
								<img
									src={SMALL_IMG_BASE_URL + item.backdrop_path}
									alt={item.title || item.name}
									className='w-full h-[130px] md:h-[160px] object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75'
									loading="lazy"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/placeholder-movie.png';
									}}
								/>
								{hoveredItem === item.id && (
									<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
												<polygon points="5 3 19 12 5 21 5 3"></polygon>
											</svg>
										</div>
									</div>
								)}
							</div>
							<div className="px-1 pt-2">
								<p className='font-medium line-clamp-1 text-gray-100 group-hover:text-white'>
									{item.title || item.name}
								</p>
								<div className="flex items-center text-sm text-gray-400 mt-1">
									{item.vote_average && (
										<div className="flex items-center mr-3">
											<Star className="size-4 fill-yellow-500 stroke-yellow-500 mr-1" />
											<span>{(item.vote_average / 2).toFixed(1)}</span>
										</div>
									)}
									<span>
										{item.release_date?.split('-')[0] || 
										 item.first_air_date?.split('-')[0] || 
										 'New'}
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			{showArrows && !loading && content.length > 0 && (
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-0 md:left-2 flex items-center justify-center
						size-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all duration-300 hover:scale-110'
						onClick={scrollLeft}
						aria-label="Scroll left"
					>
						<ChevronLeft size={20} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-0 md:right-2 flex items-center justify-center
						size-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all duration-300 hover:scale-110'
						onClick={scrollRight}
						aria-label="Scroll right"
					>
						<ChevronRight size={20} />
					</button>
				</>
			)}
		</div>
	);
};
export default MovieSlider;
