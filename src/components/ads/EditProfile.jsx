import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuid } from "uuid";
import "./EditProfile.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [img, setImg] = useState(null);

  const [data, setData] = useState({
    name: "",
    newEmail: "",
    phone: "",
    age: "",
    country: "",
    relationship: "",
    oldPassword: "",
  });
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (img) {
      const storageRef = ref(storage, "usersImages/" + uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(currentUser, {
              displayName: data.name,
              email: data.newEmail,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", currentUser.uid), {
              uid: currentUser.uid,
              photoURL: downloadURL,
              displayName: data.name,
              email: data.newEmail,
              phone: data.phone,
              age: data.age,
              country: data.country,
              relationship: data.relationship,
              createdAt: serverTimestamp(),
            });

            const credential = EmailAuthProvider.credential(
              currentUser.email,
              data.oldPassword
            );

            await reauthenticateWithCredential(currentUser, credential).then(
              async () => {
                //User reauthenticate
                await updateEmail(currentUser, data.newEmail);
              }
            );
          });
        }
      );
    } else {
      await updateProfile(currentUser, {
        displayName: data.name,
        email: data.newEmail,
      });

      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,

        displayName: data.name,
        email: data.newEmail,
        phone: data.phone,
        age: data.age,
        country: data.country,
        relationship: data.relationship,
        createdAt: serverTimestamp(),
      });

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        data.oldPassword
      );

      await reauthenticateWithCredential(currentUser, credential).then(
        async () => {
          //User reauthenticate
          await updateEmail(currentUser, data.newEmail);
        }
      );
    }
    navigate("/enter");
  };

  return (
    <div className="change">
      <div className="changeContainer">
        <div className="changeOne">
          <div className="changeAbove"></div>
          <div className="changeBot">
            <div className="changeTop">
              <h1
                onClick={(e) => {
                  setImg(e.target.files[0]);
                }}
              >
                Edit your Profile
              </h1>
            </div>
            <div className="changeBottom">
              <div className="changeTwo"></div>
              <div className="changeThree">
                <form onSubmit={handleUpdate}>
                  <div className="editFormInput">
                    <label
                      htmlFor="file"
                      onClick={(e) => {
                        setImg(e.target.files[0]);
                      }}
                    ></label>
                  </div>
                  <div className="changeFormInput">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Dildeep Gill"
                      className="changeInputColor"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="changeFormInput">
                    <label>Email</label>
                    <input
                      type="email"
                      name="newEmail"
                      required
                      placeholder="businesswithdil@gmail.com"
                      className="changeInputColor"
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="changeFormInput">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="647-877-4282"
                      className="changeInputColor"
                      onChange={handleChange}
                    />
                  </div> */}
                  {/* <div className="changeFormInput">
                    <label>Age</label>
                    <input
                      type="text"
                      placeholder="Enter Your Age"
                      className="changeInputColor"
                      name="age"
                      onChange={handleChange}
                    />
                  </div> */}
                  {/* <div className="changeFormInput">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      className="changeInputColor"
                      placeholder="Canada"
                      onChange={handleChange}
                    />
                  </div> */}
                  {/* <div className="changeFormInput">
                    <label>Relationship</label>
                    <input
                      type="text"
                      name="relationship"
                      className="changeInputColor"
                      placeholder="Enter Your Status"
                      onChange={handleChange}
                    />
                  </div> */}
                  <div className="changeFormInput">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      name="oldPassword"
                      className="changeInputColor"
                      placeholder="Enter Your Old Password"
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="updateButton">
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
