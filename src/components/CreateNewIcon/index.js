import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const CreateNewIcon = ({ handleClick }) => {
    return (
        <AddCircleOutlineOutlinedIcon
            onClick={handleClick}
            className="w-16 h-16 text-orange-600 text-4xl cursor-pointer hover:text-orange-800 mr-5"
        />
    )
}

export default CreateNewIcon