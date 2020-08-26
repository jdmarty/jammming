import React from 'react';
import './UserPlaylists.css';
import Spotify from '../../util/Spotify';
import UserPlaylistItem from '../UserPlaylistItem/UserPlaylistItem'

export class UserPlaylists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: []
        }
    }

    //get the user playlists and put them in this state (remember async to let the fetch request finish)
    async componentWillMount() {
        this.setState({ playlists: await Spotify.getUserPlaylists()});
    }

    //create a method to render the list of playlist items
    renderPlaylistNames() {
        return this.state.playlists.map(playlist => {
            return <UserPlaylistItem
                key={playlist.id}
                playlistID={playlist.id} 
                playlistName={playlist.name}
                onClick={this.props.setPlaylists}
                setPlaylist={this.props.setPlaylist}
            />
        })
    }


    render() {
        return (
        <div className="UserPlaylists">
            <h2>My Playlists</h2>
            {this.renderPlaylistNames()}
        </div>
        );
    };
};

export default UserPlaylists