import React, { Component } from 'react'
import './App.css'

import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

class App extends Component {
  constructor () {
    super()
    const params = this.getHashParams()
    const token = params.access_token
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: !!token,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      userPlaylist: { playlist: '' }
    }
  }
  getHashParams () {
    var hashParams = {}
    var e; var r = /([^&;=]+)=?([^&;]*)/g
    var q = window.location.hash.substring(1)
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2])
      e = r.exec(q)
    }
    return hashParams
  }

  getNowPlaying () {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url
          }
        })
      })
  }

  getUserPlaylists () {
    spotifyApi.getUserPlaylists()
      .then((response) => {
        this.setState({
          userPlaylist: {
            playlists: response.items[0].images[0].url
          }
        })
        console.log(response.items[19].images[0].url)
      })
  }

  render () {
    return (
      <div className='App'>
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} />
        </div>
        <div>
          <img src={this.state.userPlaylist.playlists} />
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <button onClick={() => this.getUserPlaylists()}>
            Get Playlists
        </button>
      </div>
    )
  }
}

export default App
