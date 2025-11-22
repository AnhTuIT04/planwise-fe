const LoadingScreen = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Main loader */}
      <div className="animate-speeder absolute top-1/2 left-1/2 -ml-[50px]">
        <span className="absolute top-[-19px] left-[60px] h-[5px] w-[35px] rounded-[2px_10px_1px_0] bg-black">
          <span className="animate-fazer1 absolute h-px w-[30px] bg-black"></span>
          <span className="animate-fazer2 absolute top-[3px] h-px w-[30px] bg-black"></span>
          <span className="animate-fazer3 absolute top-px h-px w-[30px] bg-black"></span>
          <span className="animate-fazer4 absolute top-1 h-px w-[30px] bg-black"></span>
        </span>

        <div className="base relative">
          <span className="absolute h-0 w-0 border-t-[6px] border-r-100 border-b-[6px] border-t-transparent border-r-black border-b-transparent">
            <span className="before:absolute before:-top-4 before:right-[-110px] before:h-[22px] before:w-[22px] before:rounded-full before:bg-black" />
            <span className="after:absolute after:-top-4 after:right-[-98px] after:h-0 after:w-0 after:border-t-0 after:border-r-55 after:border-b-16 after:border-r-black after:border-b-transparent" />
          </span>

          <div className="face absolute top-[-15px] right-[-125px] h-3 w-5 rotate-[-40deg] rounded-[20px_20px_0_0] bg-black">
            <span className="absolute top-[7px] right-1 h-3 w-3 rotate-40 rounded-[0_0_0_2px] bg-black" />
          </div>
        </div>
      </div>

      {/* Long fazers */}
      <div className="longfazers absolute h-full w-full">
        <span className="animate-lf absolute top-[20%] h-0.5 w-[20%] bg-black" />
        <span className="animate-lf2 absolute top-[40%] h-0.5 w-[20%] bg-black" />
        <span className="animate-lf3 absolute top-[60%] h-0.5 w-[20%] bg-black" />
        <span className="animate-lf4 absolute top-[80%] h-0.5 w-[20%] bg-black" />
      </div>
    </div>
  );
};

export default LoadingScreen;
