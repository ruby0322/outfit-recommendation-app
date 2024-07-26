"use server";

import CustomizationFields from "./customization-fields";
import PictureUploader from "./picture-uploader";
import SubmitButton from "./submit-button";

const UploadPage = () => {
  /* TODO: Upload Page */
  /* INFO: React states should be declared here (UploadPage) and passed down to its children. */

  return (
    <div className='w-full flex flex-col gap-8 items-center justify-center'>
      <div className='w-full flex gap-8 justify-center items-center'>
        <PictureUploader />
        <CustomizationFields />
      </div>
      <SubmitButton />
    </div>
  );
};

export default UploadPage;
