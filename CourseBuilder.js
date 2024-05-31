import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Module from './Module';
import './CourseBuilder.css';
import { FaPlus } from 'react-icons/fa';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAddModule = () => {
    const newModule = { id: `module-${Date.now()}`, title: 'New Module', resources: [] };
    setModules([...modules, newModule]);
    setFeedbackMessage('Module added');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(modules);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setModules(items);
    } else {
      const sourceModuleIndex = modules.findIndex(module => module.id === source.droppableId);
      const destModuleIndex = modules.findIndex(module => module.id === destination.droppableId);
      const sourceModule = modules[sourceModuleIndex];
      const destModule = modules[destModuleIndex];
      const sourceResources = Array.from(sourceModule.resources);
      const destResources = Array.from(destModule.resources);
      const [movedResource] = sourceResources.splice(source.index, 1);
      destResources.splice(destination.index, 0, movedResource);
      const newModules = Array.from(modules);
      newModules[sourceModuleIndex] = { ...sourceModule, resources: sourceResources };
      newModules[destModuleIndex] = { ...destModule, resources: destResources };
      setModules(newModules);
    }
  };

  return (
    <div className="course-builder">
      <h1>Course Builder</h1>
      <button className="add-module" onClick={handleToggleMenu}>
        <FaPlus className="fa-plus" /> Add
      </button>
      {showMenu && (
        <div className="menu">
          <button onClick={handleAddModule}>
            <FaPlus /> Create Module
          </button>
        </div>
      )}
      {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-modules" type="module">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Module
                        module={module}
                        setModules={setModules}
                        modules={modules}
                        setFeedbackMessage={setFeedbackMessage}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CourseBuilder;
