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
        console.log(response)
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
            trackId: response.item.id
          }
        })
      })
  }

  getAudioFeatures () {
    let trackId = spotifyApi.getMyCurrentPlaybackState()
      .then(response => response.item.id)
    console.log(trackId)
    spotifyApi.getAudioFeaturesForTrack('3Liyu0tXbecRX5or4IywR5')
      .then((response) => {
        console.log(response)
      })
  }

  render () {
    return (
      <div className='App'>
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
          Track Id: { this.state.nowPlaying.trackId }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} />
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <button onClick={() => this.getAudioFeatures()}>
          Get Features
        </button>
      </div>
    )
  }
}

export default App
