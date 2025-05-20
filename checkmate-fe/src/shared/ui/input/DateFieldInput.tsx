import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

interface DateFieldInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateFieldInput: React.FC<DateFieldInputProps> = ({
  value, onChange, onBlur, minDate, maxDate
}) => {
  const dateValue = value ? new Date(value) : null;

  const handleChange = (date: Date | null) => {
    if (!date) return;
    const formatted = format(date, 'yyyy-MM-dd');  // ex. "2025-05-21"
    onChange(formatted);
  };

  return (
    <div className="relative w-full">
      <DatePicker
        locale={ko}
        selected={dateValue}
        onChange={handleChange}
        onBlur={onBlur}
        dateFormat="yyyy-MM-dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText="연도-월-일"
        className="w-full p-2 rounded-md border bg-white border-gray-400 text-left"
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};

export default DateFieldInput;