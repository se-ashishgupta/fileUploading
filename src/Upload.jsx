import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";

const Upload = ({ modal, toggle }) => {
  const [newFolder, setNewFolder] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalFileUploaded, setTotalFileUploaded] = useState(0);
  const [pending, setPending] = useState(false);

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files);
    let total = 0;
    const inputs =
      event.target.parentNode.querySelectorAll('input[type="file"]');
    inputs.forEach((input) => {
      total += input.files.length;
    });
    setTotalFiles(total);
  };

  function clearInputField() {
    document.getElementById("myForm").reset();
  }

  const uploadHandler = async (e) => {
    e.preventDefault();

    try {
      if (!newFolder) {
        toast.error("Enter Folder Name");
        return;
      }

      if (!selectedFile) {
        toast.error("Select Files to Upload");
        return;
      }

      setPending(true);

      for (let i = 0; i < selectedFile.length; i++) {
        const formData = new FormData();
        // if (selectedFile[i].size > 500 * 1024) {
        //   continue;
        // }
        formData.append("file", selectedFile[i]);
        formData.append("folderName", newFolder);

        const response = await axios.post(
          "https://kl.ocpl.tech/uploadOnServer",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // const response = await axios.post(
        //   "https://awstest.ocpl.tech/api/uploadOnServer",
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );

        if (response.status === 200) {
          console.log(response.data, "=", i);
          setTotalFileUploaded(i);
        }
      }

      toast.success("Uploaded Successfully");

      // const intervalId = setInterval(async () => {
      //   try {
      //     const response1 = await axios.post(
      //       "https://k.ocpl.tech/api/uploadProgress",
      //       {
      //         folderName: newFolder,
      //       }
      //     );

      //     console.log(response1.data);

      //     if (response1.data.numberOfFiles === totalFiles) {
      //       clearInterval(intervalId);
      //       setPending(false);
      //       toast.success("Uploaded Successfully");
      //     }
      //   } catch (error) {
      //     if (error.response?.data) {
      //       toast.error(error.response.data);
      //     } else {
      //       toast.error(error.message);
      //     }
      //   }
      // }, 2000);
    } catch (error) {
      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    } finally {
      setPending(false);
      toggle();
      clearInputField();
      setNewFolder("");
    }
  };

  return (
    <div
      className={` ${
        modal ? "fixed" : "hidden"
      } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex  justify-center`}
    >
      {/* OverLay  */}
      <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>

      {/* Conetnt  */}
      <div className=" bg-white rounded-lg w-[90%] md:w-[60%]  p-2 absolute z-10  mt-10">
        {/* Model Header  */}
        <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">Upload</h1>
          <span className=" text-black text-xl cursor-pointer" onClick={toggle}>
            <MdOutlineClose />
          </span>
        </div>

        {/* Modal Body  */}
        <div className="px-2 py-1  my-2 h-[100%] border-purple-800 rounded">
          <form onSubmit={uploadHandler} className=" space-y-3" id="myForm">
            <div className=" flex flex-col gap-1 rounded">
              <label htmlFor="" className=" font-semibold">
                Create New Folder :
              </label>
              <input
                type="text"
                value={newFolder}
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={(e) => setNewFolder(e.target.value)}
              />
            </div>

            <div className=" flex flex-col gap-1 rounded">
              <label htmlFor="" className=" font-semibold">
                Select Document :
              </label>
              <input
                type="file"
                multiple
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={changeFileHandler}
              />
            </div>

            <div className=" py-4">
              <button
                type="submit"
                className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                disabled={pending}
              >
                {pending ? `Uploading... ${totalFileUploaded + 1} ` : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
