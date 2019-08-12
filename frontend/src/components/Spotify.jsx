import React, { Component } from 'react';
import classes from './spotify.module.css';
import axios from 'axios';

class Spotify extends Component {
  state = {
    searchText: '',
    songs: [],
    filteredPlaylist: null
  };

  changeHandle = event => {
    this.setState({ searchText: event.target.value });
  };

  clickHandle = async () => {
    const { searchText } = this.state;
    const songs = [];
    console.log(searchText);
    if (!searchText) return;
    for (let i = 0; i < searchText.length; i++) {
      try {
        const response = await axios.get(
          `http://localhost:5000/?q=${encodeURIComponent(searchText[i])}`
        );
        const data = response.data.tracks.items;
        const tracks = data.map(track => track.name);
        songs.push({ [searchText[i]]: tracks });
        console.log(songs);
      } catch (e) {
        console.log([]);
      }
    }
    this.setState({ songs });
    this.createNewPlayList();
  };

  getSpotifyData = () => {};

  createNewPlayList = () => {
    const { songs, searchText } = this.state;
    const filteredPlaylist = songs.map((song, i) => {
      return song[searchText[i]].filter(
        el => searchText[i].toLowerCase() === el.charAt(0).toLowerCase()
      )[0];
    });
    this.setState({ filteredPlaylist });
  };

  render() {
    const { filteredPlaylist, searchText } = this.state;
    let displayPlaylist = '';

    if (filteredPlaylist && searchText.length === filteredPlaylist.length) {
      displayPlaylist = filteredPlaylist.map((song, i) => (
        <div key={song} className={classes.displaySongs}>
          {searchText[i].toUpperCase()} : {song}
        </div>
      ));
    }

    return (
      <div>
        <input
          className={classes.inputBox}
          value={this.state.searchText}
          type='input'
          placeholder='Enter word to search songs'
          onChange={this.changeHandle}
        />
        <button className={classes.btn} onClick={this.clickHandle}>
          Search
        </button>
        <div className={classes.songBox}>{displayPlaylist}</div>
      </div>
    );
  }
}

export default Spotify;
