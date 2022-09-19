import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const CreateNewIcon = ({ handleClick, height, width }) => {
    return (
        <AddCircleOutlineOutlinedIcon
            onClick={handleClick}
            className={`${height ? 'h-12' : 'h-16'} ${width ? 'w-12' : 'w-16'} text-blue-600 text-4xl cursor-pointer hover:text-orange-800 mr-5`}
        />
    )
}

export default CreateNewIcon