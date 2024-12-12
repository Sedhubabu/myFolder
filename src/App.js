import React, { useEffect, useState } from "react";
import explorer from "./explorer";
import fileIcon from './images/fileIcon.png'
import folderIcon from './images/folderIcon.jpg'
import './App.css'

const Folder = ({ data, onSelect, selectedFolderId, setShowInput, setIsFolder, showInput }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState({
    file: false,
    folder: false
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (data.isFolder) {
      onSelect(data.id);
    }
  };

  const setSelectedFn = (type) => {
    type === 'file'
      ? setSelectedIcon({ folder: false, file: true })
      : setSelectedIcon({ file: false, folder: true })
  }

  useEffect(() => {
    if (!showInput) {
      setSelectedIcon({ folder: false, file: false });
    }
  }, [showInput]);

  return (
    <div id = 'parent-div'
      style={{
        marginLeft: 20,
        backgroundColor: selectedFolderId === data.id ? "#DCDCDC" : "transparent",
        padding: "5px",
        borderRadius: "5px",
        width: "325px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{ cursor: "pointer", fontWeight: data.isFolder ? "bold" : "normal" }}
          onClick={handleToggle}
        >
          {data.isFolder ? (isExpanded ? "- " : "+ ") : ""}
          {data.name}
        </span>
        {data.id === "1" && (
          <div style={{ display: "flex", gap: "10px" }}>
           <div style={selectedIcon?.file ? { borderBottom: "2px solid green" } : {}}> 
            <img className = "add-icon" src = {fileIcon} alt="Add File" style={{ width: "20px" }} onClick={() => { setShowInput(true); setIsFolder(false); setSelectedFn("file"); }}/>
           </div > 
           <div style={selectedIcon?.folder ? { borderBottom: "2px solid green" } : {}}>
            <img className = "add-icon" src = {folderIcon} alt="Add Folder" style={{ width: "20px" }} onClick={() => { setShowInput(true); setIsFolder(true); setSelectedFn("folder"); }}/>
           </div>
          </div>
        )}
      </div>
      {isExpanded &&
      Array.isArray(data.items) &&
        data.items.map((item) => (
          <Folder
            key={item.id}
            data={item}
            onSelect={onSelect}
            selectedFolderId={selectedFolderId}
            setShowInput={setShowInput}
            setIsFolder={setIsFolder}
          />
        ))}
    </div>
  );
};

const App = () => {
  const [explorerData, setExplorerData] = useState(explorer);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isFolder, setIsFolder] = useState(true);

  const addNewItem = (folderId, name, isFolder) => {
    const addHelper = (node) => {
      if (node.id === folderId && node.isFolder) {
        node.items.push({
          id: Date.now().toString(),
          name,
          isFolder,
          items: isFolder ? [] : undefined,
        });
        return true; // Stop recursion once the folder is found
      } else if (node.items) {
        for (let child of node.items) {
          if (addHelper(child)) {
            return true;
          }
        }
      }
      return false;
    };

    const updatedExplorer = { ...explorerData };
    addHelper(updatedExplorer);
    setExplorerData(updatedExplorer);
  };

  const handleCreate = (type) => {
    if (newItemName.trim() && selectedFolderId) {
      addNewItem(selectedFolderId, newItemName, type === "folder");
      setShowInput(false);
      setNewItemName("");
    }
  };

  const handleCancel = () => {
      setShowInput(false);
      setNewItemName("");
  }

  return (
    <div style={{ width: "fit-content" }}>
      <h1>Folder Structure</h1>
      {showInput && (
        <div style={{ margin: "10px 0" }}>
          <input
            type="text"
            placeholder={ isFolder ? "Enter Folder Name" : "Enter File Name" }
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button onClick={() => handleCreate(isFolder ? "folder" : "file")}>
            { isFolder ? "Create Folder" : "Create File" }
          </button>
          
          <button onClick={() => handleCancel()}> Cancel </button>
        </div>
      )}
      <Folder
        data={explorerData}
        onSelect={setSelectedFolderId}
        selectedFolderId={selectedFolderId}
        setShowInput={setShowInput}
        setIsFolder={setIsFolder}
        showInput={showInput}
      />
    </div>
  );
};

export default App;
