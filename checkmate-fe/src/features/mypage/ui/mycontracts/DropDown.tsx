import Select, { SingleValue }  from "react-select";

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    value: Option;
    onChange: (opt: Option) => void;
  }

const Dropdown:React.FC<DropdownProps> = ({ options, value, onChange }) => {
    
    return (
        <div>
            <Select
                classNamePrefix="select"
                defaultValue={options[0]}
                value={value}
                isLoading={false}
                isSearchable={false}
                name='contractOptions'
                options={options}
                onChange={(opt: SingleValue<Option>) => {
                    if (opt) onChange(opt);
                  }}
                className="basic-single focus:ring-2 focus:ring-blue-500"
             /> 
        </div>
    )
};

export default Dropdown;