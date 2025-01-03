import { useRef, useState } from 'react';
import Image from 'next/image';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { CircleAlert, X } from 'lucide-react';


interface IFileInput {
  name: string;
  btnTitle: string;
  label?: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: string;
};


export const FileInput: React.FC<IFileInput> = ({
  name, 
  btnTitle, 
  label, 
  setValue, 
  disabled, 
  register,
  error
}) => {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<any | null>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const url = await convertFileToString(file);
      setPreview(url);
      setValue(name, url);
    } else {
      setPreview(null);
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
      {label && <label htmlFor={name} className='w-full md:w-36 text-sm font-semibold'>{label}</label>}
      <div className='relative w-full md:grow'>
        <div className={`w-full flex gap-1 items-center ${!label ? 'justify-center' : ''}`}>
          <button 
            type='button'
            disabled={disabled}
            className='w-36 h-10 bg-slate-500 text-sm text-white uppercase rounded'
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
          {...register(name)} 
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
                {error}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}