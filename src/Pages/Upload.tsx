import { FormEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getCountFromServer, setDoc, doc } from 'firebase/firestore';
import { collRef, storage } from '../firebase';

const Upload = () => {
  const [thumbnailEmpty, setThumbnailEmpty] = useState(true);
  const [audioEmpty, setAudioEmpty] = useState(true);

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
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
      // Get the document count in collection
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
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.log(`Error!: ${err}`);
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
          <div className='w-full flex flex-col md:flex-row md:flex-nowrap md:justify-center md:my-5'>
            <div className='flex flex-col items-center md:mr-16'>
              <label className="text-xl text-white mb-3 md:text-2xl" htmlFor="name">
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
            <div className='flex flex-col items-center'>
              <label className="text-xl text-white mb-3 md:text-2xl" htmlFor="description">
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
          <div className='w-full flex flex-col md:flex-row md:flex-nowrap md:justify-center md:my-5'>
            <div className='flex flex-col items-center'>
              <label className="text-xl text-white mb-3 md:text-2xl" htmlFor="thumbnail">
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
            <div className='flex flex-col items-center'>
              <label className="text-xl text-white mb-3 md:text-2xl" htmlFor="audio">
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
      </main>
    </div>
  );
};

export default Upload;
