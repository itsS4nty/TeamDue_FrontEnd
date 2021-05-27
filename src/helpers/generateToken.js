import md5 from 'crypto-js/md5';
export const generateToken = () => {
    var date = Date.now() * Math.floor(Math.random() * 1001);
    return md5(date.toString()).toString();
}