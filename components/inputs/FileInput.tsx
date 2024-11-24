'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { CircleAlert, X } from 'lucide-react';


interface IFileInput {
  label?: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  defaultValue?: string;
  error?: string[]
};


const FileInput: React.FC<IFileInput> = ({ 
  name, 
  label, 
  required, 
  disabled, 
  multiple = false, 
  defaultValue,
  error 
}) => {
  const selectedFilesIntialValue = defaultValue && (multiple ? defaultValue : [defaultValue]) || [];
  const [selectedFiles, setSelectedFiles] = useState<any>(selectedFilesIntialValue);
  const ref = useRef<HTMLInputElement>(null);

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

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    ref.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = Array.from(e.target.files!);
    const pickedFiles = await Promise.all(data.map(async (item: any) => {
      const url = await convertFileToString(item);
      return url;
    }));
    if(multiple) {
      setSelectedFiles([...selectedFiles, ...pickedFiles]);
    } else {
      setSelectedFiles([...pickedFiles])
    }
  };

  const handleImageDelete = (value: any) => {
    setSelectedFiles((prevState: any[]) => prevState.filter(url => typeof url === 'string' ? url !== value : url.name !== value.name));
  };

  return (
    <div className='w-full flex items-center gap-3'>
      <input name={name} type='text' value={selectedFiles.join('|-| ')} onChange={() => {}} className='hidden' />
      {label && <label htmlFor={name} className='w-full md:w-36 text-sm font-semibold'>{label}</label>}
      <div className='relative w-full md:grow'>
        <div className={`w-full flex gap-1 items-center ${!label ? 'justify-center' : ''}`}>
          <button 
            type='button'
            disabled={disabled}
            className='w-36 h-10 bg-slate-500 text-sm text-white uppercase rounded'
            onClick={handleClick}
          >
            Upload
          </button>
          <ul className='flex gap-3 text-xs'>
            {selectedFiles.map((url: any) => (
              <li key={crypto.randomUUID()} className='relative'>
                <Image 
                  src={typeof url === 'string' ? url : URL.createObjectURL(url)} 
                  alt='Image' 
                  width={50} 
                  height={50} 
                />
                <button 
                  type='button' 
                  onClick={() => handleImageDelete(url)}
                  className='absolute top-0 right-0 w-5 h-5 flex justify-center items-center text-xs bg-white'
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <input 
          ref={ref}
          className={`hidden h-10 w-full text-sm `}
          id={name}
          type='file'
          required={required} 
          multiple={multiple}
          onChange={handleChange}
        />
        <p className='mt-1 text-xs text-red-600'>
          {error && (
            <>
              <CircleAlert />
              <span className='ml-1'>{error.join(' ')}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FileInput;