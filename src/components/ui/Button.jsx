import PropTypes from "prop-types";

/**
 * Composant bouton réutilisable
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le bouton
 */
const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    fullWidth = false,
    className = "",
    ...rest
}) => {
    // Classes de base
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors";

    // Classes de variante
    const variantClasses = {
        primary:
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
        secondary:
            "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-2 focus:ring-offset-2 focus:ring-secondary-400",
        outline:
            "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
        success:
            "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
        warning:
            "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400",
        ghost: "text-gray-700 hover:bg-gray-100",
    };

    // Classes de taille
    const sizeClasses = {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
    };

    // Classes de largeur
    const widthClasses = fullWidth ? "w-full" : "";

    // Classes pour l'état désactivé
    const disabledClasses = disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:shadow-md";

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    variant: PropTypes.oneOf([
        "primary",
        "secondary",
        "outline",
        "danger",
        "success",
        "warning",
        "ghost",
    ]),
    size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;
