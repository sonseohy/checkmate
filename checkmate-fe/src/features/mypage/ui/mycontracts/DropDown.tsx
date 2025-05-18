import { useMobile } from "@/shared";
import Select, { SingleValue, StylesConfig }  from "react-select";

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    value: Option | null;
    onChange: (opt: Option) => void;
  }

const Dropdown:React.FC<DropdownProps> = ({ options, value, onChange }) => {
    const isMobile = useMobile();

    // 커스터마이징 스타일 정의
    const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      borderColor: "#F3F4F6", // 선택된 항목의 테두리 색상
      boxShadow: "none",
      backgroundColor: "#ffffff",
      fontSize: isMobile ? '14px' : '16px',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: isMobile ? '14px' : '16px',
      backgroundColor: state.isSelected ? "#F3F4F6" : "#ffffff", // 선택된 항목 배경색
      color: "#202020", // 선택된 항목 글자색
      ":hover": {
        backgroundColor: "#F3F4F6", // 호버 시 배경색
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: isMobile ? '14px' : '16px',
      color: "#202020", // 선택된 항목 글자색
    }),
  };
    return (
        <div>
            <Select
                classNamePrefix="select"
                value={value}
                isLoading={false}
                isSearchable={false}
                name='contractOptions'
                options={options}
                onChange={(opt: SingleValue<Option>) => {
                    if (opt) onChange(opt);
                  }}
                className="basic-single"
                styles={customStyles} 
             /> 
        </div>
    )
};

export default Dropdown;