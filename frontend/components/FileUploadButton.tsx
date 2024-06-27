import { Button } from "./ui/button"



type Props = {
    text?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    max?: string;
    accept?: string;
    onChange: (e: any) => any
}

const FileUploadButton = ({ 
    text = 'Upload Image', 
    className = 'w-[100%] relative my-4 cursor-pointer', 
    disabled = false,
    id = 'image-input', 
    max = '1', 
    accept = 'image/*', 
    onChange 
  }: Props) => {
  return (
    <Button variant='outline' className={className} type="button" disabled={disabled}>
        {text}
        <input 
            name="image-input"
            id={id}
            type="file"
            max={max}
            multiple={+max > 1 ? true : false}
            accept={accept}
            className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0 cursor-pointer"
            onChange={onChange}
        />
    </Button>
  )
}

export default FileUploadButton