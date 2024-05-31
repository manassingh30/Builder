import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './Module.css';
import { FaTrash, FaLink, FaUpload, FaEdit, FaDownload, FaEllipsisV } from 'react-icons/fa';

const Module = ({ module, setModules, modules, setFeedbackMessage }) => {
  const [resources, setResources] = useState(module.resources);
  const [showOptions, setShowOptions] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [link, setLink] = useState('');
  const [newTitle, setNewTitle] = useState(module.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleAddLink = () => {
    const newResource = { id: `resource-${Date.now()}`, title: link, type: 'link' };
    setResources([...resources, newResource]);
    setLink('');
    setFeedbackMessage('Link added');
    setTimeout(() => {
      setFeedbackMessage('');
      setShowLinkInput(false); // Hide the link input field
      setShowOptions(false);   // Hide the options menu
    }, 200);
  };
  
  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newResource = { id: `resource-${Date.now()}`, title: file.name, type: 'file', file: file };
      setResources([...resources, newResource]);
      setFeedbackMessage('File uploaded');
      setTimeout(() => {
        setFeedbackMessage('');
        setShowUploadInput(false); // Hide the file upload input field
        setShowOptions(false);     // Hide the options menu
      }, 200);
    }
  };
  
  const handleDeleteModule = () => {
    setModules(modules.filter((mod) => mod.id !== module.id));
    setFeedbackMessage('Module deleted');
    setTimeout(() => {
      setFeedbackMessage('');
      setShowOptions(false);   // Hide the options menu
    }, 3000);
  };

  const handleRenameModule = () => {
    const updatedModules = modules.map((mod) => 
      mod.id === module.id ? { ...mod, title: newTitle } : mod
    );
    setModules(updatedModules);
    setIsEditingTitle(false);
    setFeedbackMessage('Module renamed');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleDeleteResource = (resourceId) => {
    setResources(resources.filter((res) => res.id !== resourceId));
    setFeedbackMessage('Resource deleted');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleRenameResource = (resourceId, newTitle) => {
    const updatedResources = resources.map((res) =>
      res.id === resourceId ? { ...res, title: newTitle } : res
    );
    setResources(updatedResources);
    setFeedbackMessage('Resource renamed');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleDownloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    setFeedbackMessage('File downloaded');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="module">
      <div className="module-options">
        <button style={{backgroundColor:"red"}} onClick={handleToggleOptions}>
          <FaEllipsisV />
        </button>
        {showOptions && (
          <div className="options">
            <button style={{backgroundColor:"red"}} onClick={handleDeleteModule}>
              <FaTrash /> Delete Module
            </button>
            <button style={{backgroundColor:"red"}} onClick={() => setShowLinkInput(!showLinkInput)}>
              <FaLink /> Add Link
            </button>
            <button style={{backgroundColor:"red"}} onClick={() => setShowUploadInput(!showUploadInput)}>
              <FaUpload /> Upload
            </button>
          </div>
        )}
      </div>
      
      {isEditingTitle ? (
        <div>
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
          />
          <button onClick={handleRenameModule}>
            <FaEdit /> Save
          </button>
        </div>
      ) : (
        <h2 onClick={() => setIsEditingTitle(true)}>
          {module.title} <FaEdit />
        </h2>
      )}
      
      {showLinkInput && (
        <div>
          <input 
            type="text" 
            value={link} 
            onChange={(e) => setLink(e.target.value)} 
            placeholder="Enter link" 
          />
          <button onClick={handleAddLink}>
            <FaLink /> Add Link
          </button>
        </div>
      )}
      
      {showUploadInput && (
        <input 
          type="file" 
          onChange={handleUploadFile} 
        />
      )}

      <Droppable droppableId={module.id} type="resource">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {resources.map((resource, index) => (
              <Draggable key={resource.id} draggableId={resource.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="resource">
                      {resource.type === 'file' ? (
                        <span>{resource.title}</span>
                      ) : (
                        <a href={resource.title} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                      )}
                      <button onClick={() => handleDeleteResource(resource.id)}>
                        <FaTrash />
                      </button>
                      {resource.type === 'file' && (
                        <button onClick={() => handleDownloadFile(resource.file)}>
                          <FaDownload />
                        </button>
                      )}
                      <button onClick={() => {
                        const newTitle = prompt('Enter new title', resource.title);
                        if (newTitle) {
                          handleRenameResource(resource.id, newTitle);
                        }
                      }}>
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Module;
