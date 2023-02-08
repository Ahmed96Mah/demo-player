import playIcon from '../assets/play-solid.svg';
import DeleteIcon from '../assets/trash-solid.svg';
import moveUp from '../assets/up-long-solid.svg';
import moveDown from '../assets/down-long-solid.svg';
import { Track } from '../Models/Track';

const Item = ({
  track,
  fullLength,
  changeCurrentTrack,
  deleteTrack,
  moveTrack
}: {
  track: Track,
  fullLength: number,
  changeCurrentTrack: Function,
  deleteTrack: Function,
  moveTrack: Function
}) => {
  return (
    <div className="flex flex-row items-center bg-amber-50/[0.2] rounded-xl w-11/12 py-5 px-2 mx-auto mb-3">
      <div className="w-3/12 mr-5 md:mr-10">
        <img className="w-full" src={track.thumbnail} alt="" />
      </div>
      <div className="flex flex-col items-start w-full">
        <p className="font-bold text-left text-base text-slate-100 md:text-xl border-b-2 w-full">
          {track.name}
        </p>
        <div className="w-full flex flex-row flex-wrap justify-between items-center mt-2 md:mt-4">
          <div className='w-fit group/delete flex flex-row items-center xl:hover:cursor-pointer' onClick={() => {
                deleteTrack(track);
                window.scrollTo(0, 0);
              }}>
            <p className='font-bold text-white text-sm mr-2 xl:group-hover/delete:text-black'>Del</p>
            <img
              className="w-3 invert xl:group-hover/delete:invert-0"
              src={DeleteIcon}
              alt=""
            />
          </div>
          <div className='w-fit group/play flex flex-row items-center xl:hover:cursor-pointer' onClick={() => {
              changeCurrentTrack(track.id);
              window.scrollTo(0, 0);
            }}>
            <p className='font-bold text-white text-sm mr-2 xl:group-hover/play:text-black'>Play</p>
            <img
            className="w-2 invert xl:group-hover/play:invert-0"
            src={playIcon}
            alt=""
            />
          </div>
          <div className='w-fit group/up flex flex-row items-center xl:hover:cursor-pointer' onClick={() => {
            moveTrack(track.id, (track.id === 0)? fullLength - 1:track.id - 1);
          }}>
            <p className='font-bold text-white text-sm mr-2 xl:group-hover/up:text-black'>Up</p>
            <img
            className="w-2 invert xl:group-hover/up:invert-0"
            src={moveUp}
            alt=""
            />
          </div>
          <div className='w-fit group/down flex flex-row items-center xl:hover:cursor-pointer' onClick={() => {
            moveTrack(track.id, (track.id === fullLength -1)? 0:track.id + 1);
          }}>
            <p className='font-bold text-white text-sm mr-2 xl:group-hover/down:text-black'>Down</p>
            <img
            className="w-2 invert xl:group-hover/down:invert-0"
            src={moveDown}
            alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
