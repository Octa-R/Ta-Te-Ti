
export function XMark({ size }: any) {
    let sizeClass = "w-6 h-6"; // Tamaño predeterminado (md)

    if (size === "sm") {
        sizeClass = "w-4 h-4"; // Tamaño pequeño
    } else if (size === "lg") {
        sizeClass = ""; // Tamaño grande
    }

    return (
        <svg
            className={`${sizeClass}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                className="stroke-blue-700"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
                strokeWidth={3.5}
                fill="current-color"
            />
        </svg>
    )
}




