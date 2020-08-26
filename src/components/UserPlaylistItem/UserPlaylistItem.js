import React from 'react';
import './UserPlaylistItem.css';

class UserPlaylistItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        this.props.setPlaylist(e.target.id);
        console.log('here')
    }
    render() {
        return (
            <div 
                className="UPI"
                onClick={this.handleClick}
                id={this.props.playlistID}>
                    
                <h3>
                        {this.props.playlistName}
                </h3>
            </div>
        );
    }
}

export default UserPlaylistItem