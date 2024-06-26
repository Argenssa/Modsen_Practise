function fetchUrls(urls) {
    const fetchPromises = urls.map(url => fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка загрузки URL: ${url}, статус: ${response.status}`);
        }
        return response.text();
    }));

    return Promise.all(fetchPromises);
}

const urls = [
    'https://soundcloud.com/sc-playlists-pl/sets/electronic-breaks',
    'https://soundcloud.com/sc-playlists-pl/sets/dreamy-folk',
    'https://soundcloud.com/trending-music-pl/sets/rock-metal-punk'
];

fetchUrls(urls)
    .then(contents => {
        contents.forEach((content, index) => {
            console.log(`Содержимое URL ${urls[index]}:`);
            console.log(content);
        });
    })
    .catch(error => {
        console.error('Произошла ошибка при загрузке URL:', error);
    });
