import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type, msg) => {
    var info;
    if(type === 'err') info = toast.error;
    else if(type === 'ok') info = toast.success;
    else info = toast.info;
    info(msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    });
}