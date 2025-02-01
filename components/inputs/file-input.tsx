import { useRef, useState } from 'react';
import Image from 'next/image';
import { 
  ControllerRenderProps, 
  UseFormRegister, 
  UseFormSetValue 
} from 'react-hook-form';
import { CircleAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';


interface IFileInput {
  name: string;
  btnTitle: string;
  label?: string;
  disabled?: boolean;
  register?: UseFormRegister<any>;
  field?: ControllerRenderProps<any>;
  setValue: UseFormSetValue<any>;
  error?: any;
};


export const FileInput: React.FC<IFileInput> = ({
  name, 
  btnTitle, 
  label, 
  field, 
  setValue, 
  disabled, 
  error
}) => {
  const t = useTranslations();
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<any | null>(undefined);

  const convertFileToString = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      ;}

      fileReader.onerror = (error: any) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<any>) => {
    const file = event.target.files?.[0];

    if(file) {
      const url = await convertFileToString(file);
      setPreview(url);
      if(field) field.onChange(file);
      setValue(name, file);
    } else {
      setPreview(undefined);
    }
  };

  const removeImage = () => {
    setPreview(null);
    hiddenFileInputRef.current!.value = '';
    setValue('image', null);
  };

  const triggerFileInput = () => hiddenFileInputRef.current?.click();


  return (
    <div className='w-full flex items-center gap-3'>
      {label && (
        <label 
          htmlFor={name} 
          className='w-full md:w-36 text-sm font-semibold'
        >
          {label}
        </label>
      )}
      <div className='relative w-full md:grow'>
        <div className={`w-full flex gap-1 items-center ${!label ? 'justify-center' : ''}`}>
          <button 
            type='button'
            disabled={disabled}
            className='w-fit h-10 px-3 bg-slate-500 text-sm text-white uppercase rounded'
            onClick={triggerFileInput}
          >
            {btnTitle}
          </button>
          {
            preview && (
              <div>
                <Image 
                  src={preview} 
                  alt='Image' 
                  width={50} 
                  height={50} 
                />
                <button 
                  type='button' 
                  onClick={removeImage}
                  className='absolute top-0 right-0 w-5 h-5 flex justify-center items-center text-xs bg-white'
                >
                  <X />
                </button>
              </div>
            )
          }
        </div>
        <input 
          ref={hiddenFileInputRef}
          hidden
          type='file'
          onChange={handleFileChange}
        />
        <p className='mt-1 text-xs text-red-600'>
          {error && (
            <>
              <CircleAlert />
              <span className='ml-1'>
                {t(error)}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}