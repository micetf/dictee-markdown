import { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Composant champ de texte réutilisable
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le champ de texte
 */
const TextField = forwardRef(
    (
        {
            label,
            id,
            name,
            type = "text",
            value,
            placeholder,
            onChange,
            onBlur,
            onKeyDown,
            disabled = false,
            required = false,
            error,
            helperText,
            fullWidth = false,
            className = "",
            ...rest
        },
        ref
    ) => {
        // Classes de base
        const baseClasses =
            "block px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm";

        // Classes pour l'état de l'input
        const stateClasses = error
            ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-primary-500 focus:border-primary-500";

        // Classes pour l'état désactivé
        const disabledClasses = disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : "";

        // Classes de largeur
        const widthClasses = fullWidth ? "w-full" : "";

        return (
            <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
                {label && (
                    <label
                        htmlFor={id || name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={type}
                        id={id || name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        required={required}
                        placeholder={placeholder}
                        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${widthClasses}`}
                        {...rest}
                    />
                </div>
                {(error || helperText) && (
                    <p
                        className={`mt-1 text-sm ${
                            error ? "text-red-600" : "text-gray-500"
                        }`}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

TextField.displayName = "TextField";

TextField.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    helperText: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default TextField;
