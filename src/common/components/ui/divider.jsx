import PropTypes from "prop-types";

const Divider = ({ label }) => {
  return (
    <div className="relative mx-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-neutral-400" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="px-2 text-xs font-semibold uppercase bg-white text-neutral-400">
          {label}
        </span>
      </div>
    </div>
  );
};

Divider.displayName = "Divider";
Divider.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Divider;
