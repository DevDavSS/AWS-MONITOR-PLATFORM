import type { ReactNode } from "react";


interface ActionButtonProps {

    children: ReactNode;

    onClick: () => void;

    icon?: ReactNode;

    disabled?: boolean;

}



export function ActionButton({

    children,

    onClick,

    icon,

    disabled = false

}: ActionButtonProps) {


    return (

        <button

            onClick={onClick}

            disabled={disabled}

            className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-white
                bg-gray-900
                rounded-lg
                px-4
                py-2
                hover:bg-gray-800
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
            "

        >

            {icon}

            {children}

        </button>

    );

}