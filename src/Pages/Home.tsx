import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { collRef, storage } from '../firebase';
import Item from '../Components/Item';
import { Track } from '../Models/Track';
import uploadIcon from '../assets/cloud-arrow-up-solid.svg';
import next from '../assets/angles-right-solid.svg';
import prev from '../assets/angles-left-solid.svg';

const Home = () => {
  const [tracks, setTracks]: [Track[], Function] = useState([]);
  // To be used to move between tracks (with next & previous)
  const [currentTrack, setCurrentTrack] = useState(0);

  const changeCurrentTrack = (id: number) => {
    setCurrentTrack(id);
  };

  const deleteTrack = async (target: Track) => {
    try {
      // Make an optimistic update
      setTracks(tracks.filter((track) => track.id !== target.id));
      // Make a document reference
      const docRef = doc(collRef, target.id.toString());
      // Delete document
      await deleteDoc(docRef);
    } catch (err) {
      console.log(`Error!: ${err}`);
    }

    try {
      const thumbnailExtract = target.thumbnail.split('?')[0].split('/');
      const thumbnailName = thumbnailExtract[thumbnailExtract.length - 1];
      const thumbnailRef = ref(storage, thumbnailName);
      const audioExtract = target.audio_src.split('?')[0].split('/');
      const audioName = audioExtract[audioExtract.length - 1];
      const audioRef = ref(storage, audioName);

      await deleteObject(thumbnailRef);
      await deleteObject(audioRef);
    } catch (err) {
      console.log(`Error!: ${err}`);
    }
  };

  useEffect(() => {
    const getTracks = async () => {
      try {
        // Get all docs from collection Reference
        const querySnapshot = await getDocs(
          query(collRef, orderBy('id', 'asc'))
        );
        // Set track list to docs data
        setTracks(querySnapshot.docs.map((doc) => doc.data()));
      } catch (err) {
        console.log(`Error!: ${err}`);
      }
    };
    getTracks();
  }, []);
  return (
    <div className="App font-space-grotesk bg-hero-mob bg-no-repeat bg-cover bg-center">
      <header className="App-header pt-10 pb-5">
        <h1 className="font-bold text-3xl text-center text-white">
          Demo Audio Player
        </h1>
      </header>
      <main className="flex flex-col items-center">
        {tracks.length === 0 && (
          <div className="h-screen pt-40">
            <svg
              className="w-1/3 fa-spin mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
            </svg>
          </div>
        )}
        {tracks.length > 0 && (
          <div className="px-3 py-10 rounded-2xl w-11/12 mx-auto flex flex-col items-center bg-slate-200/[0.4]">
            <h3 className="font-bold text-center text-xl text-stone-700 my-2">
              {tracks[currentTrack]['name']}
            </h3>
            <p className="text-center text-lg text-slate-100 my-2">
              {tracks[currentTrack]['description']}
            </p>
            <img
              className="w-7/12 my-5"
              src={tracks[currentTrack]['thumbnail']}
              alt=""
            />
            <audio
              className="w-full"
              controls
              src={tracks[currentTrack]['audio_src']}
            ></audio>
            <div className="flex flex-row flex-nowrap items-center justify-between mt-6 w-5/6">
              <button
                className="flex flex-row flex-nowrap items-center"
                onClick={() => {
                  setCurrentTrack(
                    currentTrack === 0 ? tracks.length - 1 : currentTrack - 1
                  );
                }}
              >
                <span className="text-base text-stone-200 font-bold mr-2">
                  Previous
                </span>
                <img src={prev} className="w-8 invert" alt="" />
              </button>
              <button
                className="flex flex-row flex-nowrap items-center"
                onClick={() => {
                  setCurrentTrack(
                    currentTrack === tracks.length - 1 ? 0 : currentTrack + 1
                  );
                }}
              >
                <img src={next} className="w-8 invert mr-2" alt="" />
                <span className="text-base text-stone-200 font-bold">Next</span>
              </button>
            </div>
          </div>
        )}
        <div className="w-11/12 my-10 pt-3 pb-7 bg-slate-200/[0.4] rounded-xl">
          {tracks.map((track: Track) => (
            <Item
              key={track.id}
              track={track}
              changeCurrentTrack={changeCurrentTrack}
              deleteTrack={deleteTrack}
            />
          ))}
        </div>
        <Link
          className="flex flex-row flex-nowrap items-center mb-8"
          to="/upload"
        >
          <img src={uploadIcon} className="w-10 mr-5 invert" alt="" />
          <span className="text-lg text-white">Upload New Audio</span>
        </Link>
      </main>
    </div>
  );
};

export default Home;
