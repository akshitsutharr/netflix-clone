import { Github } from "lucide-react";

const Footer = () => {
	return (
		<footer className='py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-6xl mx-auto px-4'>
				<p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
					Built by{" "}
					<a
						href='https://github.com/akshitsutharr'
						target='_blank'
						className='font-medium underline underline-offset-4 text-red-500 hover:text-red-400'
						rel='noreferrer'
					>
						Akshit Suthar
					</a>
					. The source code is available on{" "}
					<a
						href='https://github.com/akshitsutharr/netflix-clone'
						target='_blank'
						rel='noreferrer'
						className='font-medium underline underline-offset-4 text-red-500 hover:text-red-400 inline-flex items-center'
					>
						GitHub <Github className="ml-1 size-4" />
					</a>
				</p>
			</div>
		</footer>
	);
};
export default Footer;
