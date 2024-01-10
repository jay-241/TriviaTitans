import React, { useState } from 'react';

const ProfilePicture = () => {
  const [profilePic, setProfilePic] = useState('/path/to/profile-picture.jpg');

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <img
        src={profilePic}
        alt="Profile Picture"
        style={{ width: '200px', height: '200px', borderRadius: '50%' }}
      />
      <input type="file" onChange={handleProfilePicChange} />
    </div>
  );
};

export default ProfilePicture;
