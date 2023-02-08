import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getDocs,
  setDoc,
  orderBy,
  query,
  deleteDoc,
  doc,
} from 'firebase/firestore';
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
  // Define shuffle state
  const [shuffle, setShuffle] = useState(false);
  // For setting required track (From item component)
  const changeCurrentTrack = (id: number) => {
    setCurrentTrack(id);
  };
  // For deleting tracks (From item component)
  const deleteTrack = async (target: Track) => {
    // First, try deleting the document from firestore database.
    try {
      // Make an optimistic update
      setTracks(tracks.filter((track) => track.id !== target.id));
      // Make a document reference
      const docRef = doc(collRef, target.id.toString());
      // Delete document
      await deleteDoc(docRef);
    } catch (err) {
      // Show the error Div
      document.querySelector('#error')!.classList.toggle('hidden');
      // Then, after 3 seconds reload home page again.
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // Abort the delete process (Since the docs still exists)
      return;
    }

    // Then, try to delete the files from firebase storage
    try {
      // Extract the thumbnail name from its URL
      const thumbnailExtract = target.thumbnail.split('?')[0].split('/');
      const thumbnailName = thumbnailExtract[thumbnailExtract.length - 1];
      // Create thumbnail reference
      const thumbnailRef = ref(storage, thumbnailName);
      // Delete thumbnail
      await deleteObject(thumbnailRef);
    } catch (err) {}

    try {
      // Extract the audio name from its URL
      const audioExtract = target.audio_src.split('?')[0].split('/');
      const audioName = audioExtract[audioExtract.length - 1];
      // Create audio reference
      const audioRef = ref(storage, audioName);
      // Delete audio
      await deleteObject(audioRef);
    } catch (err) {}
  };

  // For Re-ordering the tracks
  const moveTrack = async (targetId: number, otherId: number) => {
    // First, get the two targets
    const mainTarget = tracks[targetId];
    const otherTarget = tracks[otherId];
    try {
      // Update main target with other target's data
      await setDoc(doc(collRef, targetId.toString()), {
        id: targetId,
        name: otherTarget.name,
        description: otherTarget.description,
        thumbnail: otherTarget.thumbnail,
        audio_src: otherTarget.audio_src,
      });
    } catch (err) {
      // In case of an error, abort the operation
      return;
    }

    try {
      // Then, update other target with main target's data
      await setDoc(doc(collRef, otherId.toString()), {
        id: otherId,
        name: mainTarget.name,
        description: mainTarget.description,
        thumbnail: mainTarget.thumbnail,
        audio_src: mainTarget.audio_src,
      });
    } catch (err) {
      // Counter the operation
      await setDoc(doc(collRef, targetId.toString()), {
        id: targetId,
        name: mainTarget.name,
        description: mainTarget.description,
        thumbnail: mainTarget.thumbnail,
        audio_src: mainTarget.audio_src,
      });
    }
    window.location.reload();
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
        document.querySelector('#error')!.classList.toggle('hidden');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };
    getTracks();
  }, []);

  return (
    <div className="App font-space-grotesk bg-hero-mob bg-no-repeat bg-cover bg-center">
      <header className="App-header pt-10 pb-5 md:pb-10">
        <h1 className="font-bold text-3xl text-center text-white md:text-5xl">
          Demo Audio Player
        </h1>
      </header>
      <main className="flex flex-col items-center">
        {tracks.length === 0 && (
          <div className="h-screen pt-40">
            <svg
              className="w-1/3 fa-spin mx-auto fill-green-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
            </svg>
            <p className="text-center text-2xl font-bold pt-10 text-green-300">
              Fetching Data...
            </p>
          </div>
        )}
        {tracks.length > 0 && (
          <div className="px-3 py-10 rounded-2xl w-11/12 mx-auto flex flex-col items-center bg-slate-200/[0.4] md:w-4/6 xl:w-1/3">
            <h3 className="font-bold text-center text-xl text-stone-700 my-2 md:text-3xl">
              {tracks[currentTrack]['name']}
            </h3>
            <p className="text-center text-lg text-slate-100 my-2 md:text-xl md:w-5/6">
              {tracks[currentTrack]['description']}
            </p>
            <img
              className="w-1/2 my-5 md:w-5/12"
              src={tracks[currentTrack]['thumbnail']}
              alt=""
            />
            <audio
              className="w-full md:w-10/12"
              autoPlay
              controls
              src={tracks[currentTrack]['audio_src']}
              onEnded={() => {
                // Move to the next track normally, If shuffle is off
                shuffle === false &&
                  setCurrentTrack(
                    currentTrack === tracks.length - 1 ? 0 : currentTrack + 1
                  );
                // Generate a random number between
                shuffle === true &&
                  setCurrentTrack(Math.floor(Math.random() * tracks.length));
              }}
            ></audio>
            <div className="flex flex-row flex-nowrap items-center justify-between mt-6 w-5/6 md:w-7/12 md:mt-10">
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
                className="flex flex-row flex-nowrap items-center mr-3"
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
            <button
              className={
                shuffle === false
                  ? 'border-2 px-10 py-1 rounded-full mt-8'
                  : 'bg-slate-100 border-2 border-transparent px-10 py-1 rounded-full mt-8'
              }
              onClick={() => {
                setShuffle(!shuffle);
              }}
            >
              <span
                className={
                  shuffle === false
                    ? 'text-base text-stone-200 font-bold'
                    : 'text-base text-black font-bold'
                }
              >
                Shuffle
              </span>
            </button>
          </div>
        )}
        <div
          className={
            tracks.length > 0
              ? 'w-11/12 my-10 pt-6 pb-3 bg-slate-200/[0.4] rounded-xl md:w-4/6 xl:w-1/3'
              : 'hidden'
          }
        >
          {tracks.length > 0 &&
            tracks.map((track: Track) => (
              <Item
                key={track.id}
                track={track}
                fullLength={tracks.length}
                changeCurrentTrack={changeCurrentTrack}
                deleteTrack={deleteTrack}
                moveTrack={moveTrack}
              />
            ))}
        </div>
        <Link
          id="link"
          className="flex flex-row flex-nowrap items-center mb-8 md:mb-12 group"
          to="/upload"
        >
          <img src={uploadIcon} className="w-10 mr-5 invert" alt="" />
          <span className="text-lg text-white md:text-xl group-hover:text-green-400 group-hover:underline group-hover:underline-offset-4">
            Upload New Audio
          </span>
        </Link>
        <div
          id="error"
          className="hidden w-11/12 h-screen bg-white absolute top-0 rounded-2xl"
        >
          <p className="pt-40 text-red-600 text-center text-2xl font-bold mb-20">
            An Error Ocurred! <br /> Please wait for the page to refresh
          </p>
          <svg
            className="w-1/3 fa-spin mx-auto fill-red-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
          </svg>
        </div>
      </main>
    </div>
  );
};

export default Home;
