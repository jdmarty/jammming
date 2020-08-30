import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import UserPlaylists from '../UserPlaylists/UserPlaylists'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.setUserPlaylistTracks = this.setUserPlaylistTracks.bind(this);
  }
  //method to add a new track to our playlist component
  addTrack(track) {
    //check if that song is already in the playlist. if not...
    if (!this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      //push this song into the state that holds are playlists (this automatically updates the state for some reason)
      this.state.playlistTracks.push(track);
      //run setState to re-render
      this.setState({
        playlistTracks: this.state.playlistTracks
      });
    } else {
      return
    };
  }
  //method to remove track from our playlist component
  removeTrack(track) {
    //filter the current playlist state down to just tracks that do not match the input id
    let newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    //again, state automatically updates when this is done (unclear), but run setState again to re-render
    this.setState({
      playlistTracks: newPlaylist
    });
  }
  //method to update playlistName state, pretty self explanatory
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }
  //method to save our playlist to a spotify account
  async savePlaylist() {
    //check if there are any songs in the playlist and do not run if there aren't
    if (this.state.playlistTracks.length === 0) return
    //map current URIs for all songs in the playlist to an array for use later
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri
    });
    //run the spotify save playlist function (see that module)
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    //reset the state to an empty playlist
    this.setState(
      { playlistName: 'New Playlist', playlistTracks: [] }
    );
  }
  //method to search Spotify for songs (async because it must await the completion of the spotifySearch function)
  async search(term) {
    this.setState(
      { searchResults: await Spotify.spotifySearch(term) }
    )
  }

  //method to update the app state to show a given playlist
  async setUserPlaylistTracks(id) {
    this.setState(
      { playlistTracks: await Spotify.getUserPlaylistTracks(id) }
    );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing!</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults 
            searchResults={this.state.searchResults}
            onAdd={this.addTrack} />
          <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack}
            onNameChange = {this.updatePlaylistName}
            onSave = {this.savePlaylist}/>
        </div>
        <div className='App-userplaylists'>
          <UserPlaylists 
            setPlaylist={this.setUserPlaylistTracks}/>
        </div>
      </div>
    </div>
    );
  };
};

export default App;
