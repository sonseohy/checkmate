import { useMediaQuery } from "react-responsive";

const useMobile = () => {
    return useMediaQuery({ query: "(max-width: 768px)"})
};

export default useMobile;