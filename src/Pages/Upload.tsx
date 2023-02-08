import { FormEventHandler, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getCountFromServer, setDoc, doc } from 'firebase/firestore';
import { collRef, storage } from '../firebase';

const Upload = () => {
  // First defiene two states for files upload status
  const [thumbnailEmpty, setThumbnailEmpty] = useState(true);
  const [audioEmpty, setAudioEmpty] = useState(true);
  // Get the navigate function
  const navigate = useNavigate();

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
    // Show loading Div to user
    document.querySelector('#loading')!.classList.toggle('hidden');
    // Get the chosen files
    const thumbnail = (
      (e.target as HTMLFormElement).thumbnail as HTMLInputElement
    ).files![0];

    const audio = ((e.target as HTMLFormElement).audio as HTMLInputElement)
      .files![0];
    // Make a thumbnail reference
    const thumbnailRef = ref(storage, thumbnail.name);
    // Make a audio reference
    const audioRef = ref(storage, audio.name);

    // Add file metadata
    const thumbnailMetadata = {
      contentType: `${thumbnail.type}`,
    };
    const audioMetadata = {
      contentType: `${audio.type}`,
    };

    try {
      // Upload the thumbnail to storage
      await uploadBytes(thumbnailRef, thumbnail, thumbnailMetadata);
      // Upload the audio to storage
      await uploadBytes(audioRef, audio, audioMetadata);
      // Get the thumbnail Download URL
      const thumbnailURL = await getDownloadURL(thumbnailRef);
      // Get the audio Download URL
      const audioURL = await getDownloadURL(audioRef);
      // Get the document count in collection (For setting the new document id)
      const snapshot = await getCountFromServer(collRef);
      const count = snapshot.data().count;
      // Add a document with the count as its unique id
      await setDoc(doc(collRef, count.toString()), {
        id: count,
        name: (
          (e.target as HTMLFormElement).name as unknown as HTMLInputElement
        ).value,
        description: (
          (e.target as HTMLFormElement)
            .description as unknown as HTMLInputElement
        ).value,
        thumbnail: thumbnailURL,
        audio_src: audioURL,
      });

      // Re-set the form
      (e.target as HTMLFormElement).reset();
      // After 2 secs, return to home page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      document.querySelector('#loading')!.classList.toggle('hidden');
      // In case any error happened before saving the document
      return;
    }
  };

  return (
    <div className="App font-space-grotesk bg-hero-mob bg-no-repeat bg-cover bg-center h-screen">
      <header className="App-header pt-10 pb-5 md:pt-16">
        <h1 className="font-bold text-3xl text-center text-stone-300 md:text-4xl">
          Upload New Audio
        </h1>
      </header>
      <main className="flex flex-col items-center md:mt-16">
        <form
          className="flex flex-col items-center md:w-9/12"
          onSubmit={handleFormSubmit as unknown as FormEventHandler}
        >
          <div className="w-full flex flex-col md:flex-row md:flex-nowrap md:justify-center md:my-5">
            <div className="flex flex-col items-center md:mr-16">
              <label
                className="text-xl text-white mb-3 md:text-2xl"
                htmlFor="name"
              >
                Choose a name
              </label>
              <input
                className="mb-7 w-8/12 px-3 py-2 text-center rounded-xl md:w-full"
                type="text"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="flex flex-col items-center">
              <label
                className="text-xl text-white mb-3 md:text-2xl"
                htmlFor="description"
              >
                Choose a description
              </label>
              <input
                className="mb-7 w-8/12 px-3 py-2 text-center rounded-xl md:w-full"
                type="text"
                id="description"
                name="description"
                required
              />
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row md:flex-nowrap md:justify-center md:my-5">
            <div className="flex flex-col items-center">
              <label
                className="text-xl text-white mb-3 md:text-2xl"
                htmlFor="thumbnail"
              >
                Choose a Thumbnail
              </label>
              <input
                className="mx-auto w-8/12 mb-6 text-white file:cursor-pointer file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={() => {
                  setThumbnailEmpty(false);
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <label
                className="text-xl text-white mb-3 md:text-2xl"
                htmlFor="audio"
              >
                Choose an Audio
              </label>
              <input
                className="mx-auto w-8/12 mb-3 text-white file:cursor-pointer file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                type="file"
                id="audio"
                name="audio"
                accept="audio/*"
                onChange={() => {
                  setAudioEmpty(false);
                }}
              />
            </div>
          </div>
          <button
            className="my-5 bg-violet-50 font-bold text-lg text-violet-700 px-10 border py-1 rounded-xl hover:bg-violet-100 hover:text-violet-900 disabled:bg-slate-400 disabled:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed md:text-xl md:px-14 md:py-2"
            disabled={
              thumbnailEmpty === false && audioEmpty === false ? false : true
            }
          >
            Submit
          </button>
        </form>
        <Link className="mt-5" to="/">
          <span className="text-white text-lg font-bold underline underline-offset-4 md:text-2xl hover:text-green-400">
            Return to Home
          </span>
        </Link>
        <div
          id="loading"
          className="hidden shadow-4xl shadow-slate-400/[0.5] w-11/12 bg-white absolute top-40 rounded-2xl md:top-80 xl:top-40"
        >
          <p className="pt-20 text-green-600 text-center text-xl font-bold mb-10 w-5/6 mx-auto md:text-2xl xl:text-3xl">
            Please Wait until we upload your files...
          </p>
          <svg
            className="w-1/3 fa-spin mx-auto fill-green-600 mb-14 md:w-1/5 xl:w-1/6"
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

export default Upload;
