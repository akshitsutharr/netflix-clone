import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Loader, Play, RefreshCw } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES } from "../../utils/constants";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider";
import { useState } from "react";
import toast from "react-hot-toast";

const HomeScreen = () => {
	const { trendingContent, isLoading, error } = useGetTrendingContent();
	const { contentType, setContentType } = useContentStore();
	const [imgLoading, setImgLoading] = useState(true);

	const handleRetry = () => {
		window.location.reload();
	};

	if (isLoading || !trendingContent) {
		return (
			<div className='h-screen text-white relative'>
				<Navbar />
				<div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-10'>
					<Loader className='animate-spin text-red-600 size-16' />
				</div>
			</div>
		);
	}

	if (error) {
		console.error("Content loading error:", error);
		return (
			<div className='h-screen text-white relative'>
				<Navbar />
				<div className='absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center'>
					<div className="text-center">
						<h2 className="text-2xl mb-4">Failed to load content</h2>
						<p className="mb-8 text-gray-400">{error}</p>
						<button 
							onClick={handleRetry}
							className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center mx-auto"
						>
							<RefreshCw className="mr-2 size-5" />
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='relative h-screen text-white'>
				<Navbar />

				{/* Loading state for hero image */}
				{imgLoading && (
					<div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer z-10'>
						<Loader className='animate-spin text-red-600 size-12' />
					</div>
				)}

				{trendingContent?.backdrop_path ? (
					<img
						src={ORIGINAL_IMG_BASE_URL + trendingContent.backdrop_path}
						alt={trendingContent.title || trendingContent.name}
						className='absolute top-0 left-0 w-full h-full object-cover -z-50'
						onLoad={() => setImgLoading(false)}
						onError={() => {
							setImgLoading(false);
							console.error("Failed to load hero image");
						}}
					/>
				) : (
					<div className='absolute top-0 left-0 w-full h-full bg-gray-900 -z-50'></div>
				)}

				<div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-40' aria-hidden='true' />

				<div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32'>
					<div
						className='bg-gradient-to-b from-black via-transparent to-transparent 
						absolute w-full h-full top-0 left-0 -z-30'
					/>

					<div className='max-w-2xl'>
						<h1 className='mt-4 text-4xl md:text-6xl font-extrabold text-balance'>
							{trendingContent?.title || trendingContent?.name || "Trending Content"}
						</h1>
						<p className='mt-2 text-lg'>
							{trendingContent?.release_date?.split("-")[0] ||
								(trendingContent?.first_air_date && trendingContent?.first_air_date.split("-")[0]) ||
								"New"}{" "}
							| {trendingContent?.adult ? "18+" : "PG-13"}
						</p>

						<p className='mt-4 text-lg line-clamp-4'>
							{trendingContent?.overview 
								? trendingContent.overview
								: "No description available"}
						</p>
					</div>

					<div className='flex mt-8'>
						<Link
							to={`/watch/${trendingContent?.id}`}
							className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
							items-center transition duration-300'
						>
							<Play className='size-6 mr-2 fill-black' />
							Play
						</Link>

						<Link
							to={`/watch/${trendingContent?.id}`}
							className='bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center transition duration-300'
						>
							<Info className='size-6 mr-2' />
							More Info
						</Link>
					</div>
				</div>
			</div>

			<div className='sticky top-0 z-50 bg-black border-b border-gray-800'>
				<div className='max-w-screen-2xl mx-auto'>
					<div className='px-5 md:px-10 py-3 flex gap-4 text-white'>
						<button 
							onClick={() => setContentType("movie")}
							className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 ${contentType === "movie" ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}`}
						>
							Movies
						</button>
						<button 
							onClick={() => setContentType("tv")}
							className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 ${contentType === "tv" ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}`}
						>
							TV Shows
						</button>
					</div>
				</div>
			</div>

			<div className='bg-black pt-6 pb-16'>
				<div className='max-w-screen-2xl mx-auto'>
					<div className='flex flex-col gap-12'>
						{contentType === "movie"
							? MOVIE_CATEGORIES.map((category) => (
								<div key={category} className="px-1">
									<MovieSlider category={category} />
								</div>
							))
							: TV_CATEGORIES.map((category) => (
								<div key={category} className="px-1">
									<MovieSlider category={category} />
								</div>
							))}
					</div>
				</div>
			</div>
		</>
	);
};
export default HomeScreen;
