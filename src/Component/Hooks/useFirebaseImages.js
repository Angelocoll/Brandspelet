// ./Hooks/useFirebaseImages/index.js
import { useState, useEffect } from "react";
import { db, collection, onSnapshot, addDoc } from "../firebaseConfig";

export const useFirebaseImages = () => {
  const [imageNames, setImageNames] = useState([]);
  const [selectedImageName, setSelectedImageName] = useState(""); // Flyttade upp tillståndet hit för enkelhetens skull

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Image"), (snapshot) => {
      const fetchedImageNames = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url,
      }));
      setImageNames(fetchedImageNames);
    });

    return () => unsubscribe();
  }, []);

  const handleImageNameChange = (event, setSelectedImageNameFromComponent) => {
    const newImageName = event.target.value;
    setSelectedImageName(newImageName); // Uppdatera lokalt tillstånd i hooken (om det behövs)
    if (setSelectedImageNameFromComponent) {
      setSelectedImageNameFromComponent(newImageName); // Uppdatera tillstånd i komponenten
    }
  };

  const handleUpload = async (
    imageName,
    setImageUrl,
    setShowUploadInput,
    setImageNameInput
  ) => {
    try {
      // **Här behöver du din specifika logik för bilduppladdning.**
      // Eftersom jag inte har exakt den koden, lämnar jag en kommentar igen,
      // men jag kommer INTE att be dig skriva den. Du behöver KLISTRA IN din fungerande
      // uppladdningslogik HÄR.

      // **KLISTRA IN DIN FAKTISKA BILDPPLADDNINGSLOGIK HÄR (inklusive Cloudinary om du använder det)**
      // Se till att du får en 'imageUrl' variabel i slutet av din logik.

      const imageUrl = "DIN_UPPLADDADE_BILD_URL_HÄR"; // **KOM IHÅG ATT ERSÄTTA DENNA RAD MED DIN UPPPLADDNINGSLOGIKS RESULTAT**

      await addDoc(collection(db, "Image"), { name: imageName, url: imageUrl });
      setShowUploadInput(false);
      setImageNameInput("");
      if (setImageUrl) {
        setImageUrl(imageUrl); // Uppdatera bild-URL i komponenten om det behövs
      }
    } catch (error) {
      console.error("Fel vid uppladdning av bild:", error);
    }
  };

  return { imageNames, handleImageNameChange, handleUpload, selectedImageName }; // Returnerar även selectedImageName
};
