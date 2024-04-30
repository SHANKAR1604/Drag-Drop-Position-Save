import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';

const itemsFromBackend = [
  { id: uuidv4(), content: "Contact Name" },
  { id: uuidv4(), content: "Address 1" },
  { id: uuidv4(), content: "Address 2" },
  { id: uuidv4(), content: "Address 3" },
  { id: uuidv4(), content: "Country" },
  { id: uuidv4(), content: "PostalCode" },
  { id: uuidv4(), content: "Phone" },
  { id: uuidv4(), content: "Email" },
  { id: uuidv4(), content: "Fax" },
  { id: uuidv4(), content: "Tax" },
  { id: uuidv4(), content: "Remarks" },
];

const initialColumns = {
  sidebar: {
    name: "Sidebar",
    items: itemsFromBackend,
    width: 250,
    borderColor: 'white',
  },
  layout1: {
    name: "Layout 1",
    items: [],
    width: 250,
    borderColor: 'white',
  },
  layout2: {
    name: "Layout 2",
    items: [],
    width: 250,
    borderColor: 'white',
  },
};

const App = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnText, setNewColumnText] = useState("");

  // Load saved positions from localStorage on initial render
  useEffect(() => {
    const savedColumns = localStorage.getItem("columns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  // Save positions to localStorage
  const savePositions = () => {
    localStorage.setItem("columns", JSON.stringify(columns));
    alert("Column position saved successfully");
  };

  // // Add a new column
  // const addColumn = () => {
  //   const newColumnId = `newColumn${Object.keys(columns.sidebar.items).length + 1}`;
  //   const newColumn = {
  //     id: newColumnId,
  //     content: newColumnText // Use the provided text for the new column
  //   };
  //   setColumns({
  //     ...columns,
  //     sidebar: {
  //       ...columns.sidebar,
  //       items: [...columns.sidebar.items, newColumn]
  //     }
  //   });
  //   //setNewColumnName(""); // Reset input fields after adding the column
  //   setNewColumnText("");
  // };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <div style={{ width: 1000, margin: 8, borderColor: `${columns.borderColor}`, borderWidth: 2, borderStyle: "solid" }}>
      <div style={{ display: "flex", justifyContent: "left", height: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column], index) => (
            <div
              className="demo"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <div style={{ margin: 8, borderColor: "white", borderWidth: 2, borderStyle: "solid" }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="column"
                      style={{
                        background: snapshot.isDraggingOver ? "#fbfcfe" : "#fbfcfe",
                        padding: 4,
                        width: `260px`,
                        height: 800,
                        overflowY: "auto",
                      }}
                    >
                      <h2 style={{ textAlign: "left" }}>{column.name}</h2>
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 2,
                                margin: "0 0 8px 0",
                                minHeight: "50px",
                                textAlign: "center",
                                borderColor: "black", borderWidth: 1, borderStyle: "solid", width: 200,
                                backgroundColor: snapshot.isDragging ? "lightblue" : "white",
                                color: "black",
                                fontSize: "20px",
                                ...provided.draggableProps.style
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
      <div>
        {/* <input
          type="text"
          placeholder="Enter column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        /> */}
        {/* <input 
          type="text"
          placeholder="Enter column text"
          value={newColumnText}
          onChange={(e) => setNewColumnText(e.target.value)}
        />
        <button onClick={addColumn} style={{marginLeft:15}} >Add New Column</button> */}
        <button onClick={savePositions} style={{marginLeft:15}} >Save Positions</button>
      </div>
    
    </div>
  );
};

export default App;