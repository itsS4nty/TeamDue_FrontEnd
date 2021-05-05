export const getFiles = async() => {
    const url = `https://api.giphy.com/v1/gifs/search?q=${encodeURI('archivo')}&limit=10&api_key=FxafarR7iSpO4jI9p7V9fCOhLsKYZuzl`;
    const resp = await fetch(url);
    const {data} = await resp.json();
    const gifs = data.map(img => {
        return {
            id: img.id,
            title: img.title
        }
    })
    return gifs;
}