

export function OMark({ size }: any) {
    let sizeClass = "w-6 h-6"; // Tamaño predeterminado (md)

    if (size === "sm") {
        sizeClass = "w-4 h-4"; // Tamaño pequeño
    } else if (size === "lg") {
        sizeClass = "p-4"; // Tamaño grande
    }

    return (
        <svg
            className={`${sizeClass} `}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="transparent"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                className="stroke-red-500"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3.8}
                fill="current-color"
            >
            </path>
        </svg>
    )
}