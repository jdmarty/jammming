let token
const clientID = 'f2613578ef4142afad974383eab4d925';
const redirectURI = 'http://localhost:3000/';
let userID;

const Spotify = {
    //method to get an access token (run before module is exported)
    getAccessToken() {
        //if we already have one, do nothing
        if (token) {
            return token
        //if there is one in the URL, find it using hash methods (see spotify implicit control flow)
        } else if (window.location.hash) {
            let hashString = window.location.hash;
            token = hashString.split('&')[0].split('=')[1];
            //set a timeout function to reset the token when the time limit is reached
            let expiresIn = parseInt(hashString.split('expires_in=')[1]);
            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return token
        //if there isnt one in the URL, redirect to the authorization page (URI whitelisted in spotify developer app)
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    //method to search spotify for songs based on a keyword
    spotifySearch(term) {
        //use spotify API to get a list of songs (authorization must be submitted)
        return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
            headers: {Authorization: `Bearer ${token}`}
          })
        .then(response => {
            return response.json()
        //map that array of songs to an array we can use in our react app
        }).then(jsonResponse => {
            if (jsonResponse.tracks.items) {
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }
                });
            } else {
                return [];
            };
        });
    },
    
    //method to get the current users ID if it is not already set
    //must be async to return promise even if there is already a user ID to let .then work
    async getUserID() {
        if (userID) {
            await console.log(userID);
            return userID
        };
        let headers = {Authorization: `Bearer ${token}`};
        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => {
            return response.json()
        }).then(jsonResponse => {
            userID = jsonResponse.id
            return userID
        })
    },

    //method to return the names and ids of all the current users playlists
    getUserPlaylists() {
        let headers = {Authorization: `Bearer ${token}`};
        return this.getUserID()
        .then(userID => {
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {headers: headers})
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            return jsonResponse.items.map(playlist => {
                return {
                    name: playlist.name,
                    id: playlist.id
                }
            })
        });
    },

    //method to return all the tracks in a given playlist
    getUserPlaylistTracks(id) {
        let headers = {Authorization: `Bearer ${token}`};
        return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {headers: headers})
        .then(response => {
            return response.json()
        }).then(jsonResponse => {
            if (jsonResponse.items) {
                return jsonResponse.items.map(track => {
                    return {
                        id: track.track.id,
                        name: track.track.name,
                        artist: track.track.artists[0].name,
                        album: track.track.album.name,
                        uri: track.track.uri
                    }
                });
            } else {
                return [];
            };
        })
    },

    //method to save the songs in the playlist to a spotify account
    savePlaylist(name, trackURIs) {
        let headers = {Authorization: `Bearer ${token}`};
        let playlistID

        //initial fetch to get our user id
        this.getUserID()
        //then pass that id into spotify API to create a new playlist in our account and get the id of that list
        .then(userID => {
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({name: name})
            })
            .then(response => {
                return response.json()
            }).then(jsonResponse => {
                playlistID = jsonResponse.id;
                return playlistID
            //then pass that playlist id into spotify API to send a list of our uris to the new playlist
            }).then(playlistID => {
                fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({uris: trackURIs})
                });       
            });
        });
    }
}

Spotify.getAccessToken();
Spotify.getUserPlaylists();
Spotify.getUserPlaylistTracks('6S5vrthVmSGg1qCHgiywaj');


export default Spotify

