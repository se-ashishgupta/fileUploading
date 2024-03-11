import React, { useState } from "react";
import "./app.scss";
import Upload from "./Upload";

const App = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div className=" h-[50vh] p-4 flex items-start justify-center">
      <button
        className="p-3 w-fit rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300"
        onClick={toggle}
      >
        Upload
      </button>
      <Upload toggle={toggle} modal={modal} />
    </div>
  );
};

export default App;
