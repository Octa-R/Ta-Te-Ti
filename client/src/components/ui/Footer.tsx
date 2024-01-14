import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
function Footer() {
	return (
		<footer className="bg-slate-700 w-full fixed bottom-0 text-slate-50 h-10 flex">
			<div className="container mx-auto text-center flex flex-grow justify-center items-center ">
				with ❤ by octa
				<a
					href="https://github.com/Octa-R"
					target="_blank"
					rel="noopener noreferrer"
					className="ml-4 flex self-stretch"
					style={{ color: "#FFF" }}
				>
					<FaGithub className="self-center" />
				</a>
				<a
					href="https://www.linkedin.com/in/octavio-r-46a38a155/"
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2 flex self-stretch"
					style={{ color: "#FFF" }}
				>
					<FaLinkedin className="self-center" />
				</a>
			</div>
		</footer>
	);
}

export { Footer };
