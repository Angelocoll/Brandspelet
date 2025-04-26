import React, { useState, useRef, useEffect } from "react";
import EditableClickListener from "../Component/Brandspel";



function AdminPage() {

    const [helpTexts, setHelpTexts] = useState([]);
  return (
    <>
     
     <EditableClickListener onDataReady={setHelpTexts} />
    
    
    </>
  );
}

export default AdminPage;
