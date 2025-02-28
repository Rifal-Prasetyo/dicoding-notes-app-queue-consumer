const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(userId) {
    const queryPlaylistInfo = {
      text: `SELECT playlists.id, playlists.name FROM playlists
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [userId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylistInfo);
    const querySongs = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [resultPlaylist.rows[0].id],
    };
    const resultSongs = await this._pool.query(querySongs);
    const playlist = resultPlaylist.rows[0];
    playlist.songs = resultSongs.rows;

    return { playlist };
  }
}

module.exports = PlaylistsService;
