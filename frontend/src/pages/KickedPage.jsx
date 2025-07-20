import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const KickedPage = () => {
  // const navigate = useNavigate();

  useEffect(() => {
    // Clear session so they don't rejoin on refresh
    sessionStorage.clear();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Badge */}
      <span className="text-sm bg-[#6B4EFF] text-white px-4 py-1 rounded-full mb-6 font-medium shadow-md">
        ✦ Intervue Poll
      </span>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-4">
        You've been <span className="font-bold">Kicked out !</span>
      </h1>

      {/* Subtext */}
      <p className="text-[#6B6F76] text-sm sm:text-base max-w-md">
        Looks like the teacher had removed you from the poll system. Please<br className="hidden sm:block" />
        Try again sometime.
      </p>
    </div>
  );
};

export default KickedPage;