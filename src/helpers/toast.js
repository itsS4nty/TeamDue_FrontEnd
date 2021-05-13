import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type, msg) => {
    var toastType, pos = 'bottom-center';
    if(type === 'err') toastType = toast.error;
    else if(type === 'ok') toastType = toast.success;
    else if(type === 'info') toastType = toast.info
    else toastType = toast;
    if(type == 'request') pos = 'top-center';
    toastType(msg, {
        closeButton: false,
        position: pos,
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: false,
        progress: undefined,
    });
}