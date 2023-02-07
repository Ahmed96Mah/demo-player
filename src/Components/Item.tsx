import playIcon from '../assets/play-solid.svg';
import DeleteIcon from '../assets/trash-solid.svg';
import { Track } from '../Models/Track';

const Item = ({
  track,
  changeCurrentTrack,
  deleteTrack,
}: {
  track: Track;
  changeCurrentTrack: Function;
  deleteTrack: Function;
}) => {
  return (
    <div className="flex flex-row items-center border-b-2 w-10/12 py-5 mx-auto">
      <div className="w-3/12 mr-5 md:mr-10">
        <img className="w-full" src={track.thumbnail} alt="" />
      </div>
      <div className="flex flex-col items-start">
        <p className="font-bold text-left text-base text-slate-100 md:text-xl">
          {track.name}
        </p>
        <div className="flex flex-row items-center mt-2 md:mt-4">
          <img
            className="w-5 mr-8 invert cursor-pointer hover:invert-0"
            src={playIcon}
            alt=""
            onClick={() => {
              changeCurrentTrack(track.id);
            }}
          />
          <img
            className="w-5 invert cursor-pointer hover:invert-0"
            src={DeleteIcon}
            alt=""
            onClick={() => {
              deleteTrack(track);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Item;
