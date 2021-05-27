import { cookies } from "./createCookies";

export const getFiles = async() => {
    const url = `http://51.38.225.18:3000/files/${cookies.get('userId')}`;
    const resp = await fetch(url);
    const data = await resp.json();
    console.log(data);
    const files = data.map(file => {
        return {
            id: file.id,
            nombre: file.nombre,
            tipo: file.tipo,
            UsuarioId: file.UsuarioId
        }
    })
    return files;
}