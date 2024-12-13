import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckedState } from '@radix-ui/react-checkbox';


interface ICheckboxField {
  label: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: CheckedState) => void;
};

export const CheckboxField: React.FC<ICheckboxField> = ({
  label,
  name,
  checked,
  disabled,
  onChange
}) => {
  return (
    <div className='flex items-center gap-3'>
      <Checkbox 
        id={name} 
        name={name} 
        checked={checked} 
        disabled={disabled} 
        onCheckedChange={onChange}
        className='w-6 h-6 bg-primary-7 rounded text-white' 
      />
      <Label htmlFor={name} className='text-sm font-semibold'>
        {label}
      </Label>
    </div>
  );
};