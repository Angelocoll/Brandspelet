import { useState, useEffect } from "react";
import { db, collection, onSnapshot } from "../firebaseConfig";

export const useFirebaseMarkers = (selectedImageName, onDataReady) => {
  const [savedData, setSavedData] = useState([]);
  const [htmlTextArray, setHtmlTextArray] = useState([]);

  useEffect(() => {
    if (!selectedImageName) {
      setSavedData([]);
      setHtmlTextArray([]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "Markers"), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredData = fetchedData.filter(
        (marker) => marker.to === selectedImageName
      );
      const htmlTexts = filteredData.map((item) => item.htmlText);

      setSavedData(filteredData);
      setHtmlTextArray(htmlTexts);

      if (typeof onDataReady === "function") {
        onDataReady(htmlTexts);
      }
    });

    return () => unsubscribe();
  }, [selectedImageName, onDataReady]);

  return { savedData, htmlTextArray };
};
