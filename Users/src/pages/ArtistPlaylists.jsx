import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlaylistCard from '../components/PlaylistCard';
import { artistPlaylistFetch } from '../Store/actions/musicaction.jsx';

const ArtistPlaylists = () => {
  const dispatch = useDispatch();
  const { artistPlaylist } = useSelector((state) => state.music);

  useEffect(() => {
    dispatch(artistPlaylistFetch());
  }, [dispatch]);


  return (
    <div className="px-4 py-6 sm:p-6">
      <h1 className="text-4xl font-bold text-white mb-8">Artist Playlists</h1>
      <p className="text-[#b3b3b3] mb-6">Curated playlists by your favorite artists</p>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        {artistPlaylist && artistPlaylist.map((playlist) => (
          <PlaylistCard key={playlist._id || playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default ArtistPlaylists;
