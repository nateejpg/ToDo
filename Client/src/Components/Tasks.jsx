import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import done from "../images/done.png";
import trash from "../images/trashbin.png";
import edit from "../images/edit.png";
import axios from "axios";

const Crud = () => {
  const [toDos, setToDos] = useState([]);
  const [editingToDo, setEditingToDo] = useState(null);
  const [defaultA, setDefaultA] = useState([]);
  const [user, setUser] = useState(true);
  const [stack, setStack] = useState({
    content: "",
    difficulty: "Hard",
  })

  const [updatedStack, setUpdatedStack] = useState({

    content: "",
    difficulty: "",
  })
  
  const getColor = (difficulty) => {
    switch (difficulty) {
      case "Hard":
        return "rgb(245, 29, 29)";
      case "Moderate":
        return "yellow";
      case "Easy":
        return "lightgreen";
      case "Default":
        return "red";
    }
  };

  console.log(updatedStack)

  const navigate = useNavigate();

  useEffect(() => {

    const fetchDefault = async () => {

      if(!user){

        try{
            const response = await fetch("http://localhost:8800/default");
            const data = await response.json();

            setDefaultA(data);

        }catch(err){
            console.log(err);
        }
    }else{

      try{

        const response = await fetch("http://localhost:8800/Stacks");
        const data = await response.json();

        setToDos(data);
        
      }catch(err){
        console.log(err);
      }
    }
  }

    fetchDefault();

    console.log(toDos)
  },[])

  const addToDo = async () => {

    setUser(true)

    try{

      await axios.post("http://localhost:8800/Stacks", stack);

    }catch(err){
      console.log(err);
    }

    // Add the feature that reloads won't be necessary!
    window.location.reload();
  };

  const editToDo = (todoID) => {

    setEditingToDo(todoID);

  };


  const handleChange = (e) => {

    setStack((prev) => ({...prev,[e.target.name]: e.target.value}));


  }

  const handleChangeUpdate = (e) => {

    setUpdatedStack((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleDelete = async (id) => {

    try{

      await axios.delete(`http://localhost:8800/Stacks/${id}`);

      const updatedItems = toDos.filter(stack => stack.id !== id);

      setToDos(updatedItems);

    }catch(err){
      console.log(err)
    }

  }

  const handleUpdate = async (id) => {

    try{

      await axios.put(`http://localhost:8800/Stacks/${id}`, updatedStack);
      
      setEditingToDo(null);

      navigate("/");

      window.location.reload();
      
    }catch(err){

      console.log(err);

    }
  }

  return (
    <div className="wrapper">
      <div className="crud">
        <input
          type= "text"
          name = "content"
          placeholder="Enter your Stack!"
          onChange={handleChange}
          maxLength={90}
        />
        <select
          name="difficulty"
          onChange={handleChange}
        >
          <option value="Hard">Urgent 🔴</option>
          <option value="Moderate"> Queued 🟡</option>
          <option value="Easy">  Paced 🟢</option>
        </select>
        <button onClick={addToDo}>Add Stack</button>
      </div>
        <div className="toDoWrapper">
        {!user || toDos.length === 0 ? (defaultA.map((task) => (
            <div className="toDoColor" key={task.id} style={{background: getColor(task.difficulty)}}>
              <div className="toDoBtnEdit"><button><img src={edit}/></button></div>
                <div className="toDoText"><h1>{task.content}</h1></div>
               <div className="toDoBtn">
                <button>
                  <img src={trash}></img>
                </button>
                <button>
                  <img src={done}></img>
                </button>
              </div>
        </div>
        ))) : (toDos.map((toDo) => (
            <div
              className="toDoColor"
              key={toDo.id}
              style={{ background: getColor(toDo.difficulty) }}
            >
            <div className="toDoBtnEdit"><button onClick={() => editToDo(toDo.id)}><img src={edit}/></button></div>
              {editingToDo === toDo.id ? (
                <div className="saveToDo">
                  <input
                    placeholder="edit your ToDo"
                    type="text"
                    name="content"
                    onChange={handleChangeUpdate}
                  />
                  <div className="saveToDoBtns">
                  <button value ="Hard" name="difficulty" onClick={handleChangeUpdate}>🔴</button>
                  <button value="Easy" name="difficulty" onClick={handleChangeUpdate}>🟢</button>
                  <button value="Moderate"  name="difficulty" onClick={handleChangeUpdate}>🟡</button>
                  </div>
                  <button onClick={() => handleUpdate(toDo.id)}>
                    <img src={edit}></img>
                  </button>
                </div>
              ) : (
                <div className="toDoText">
                  <h1>{toDo.content}</h1>
                </div>
              )}
              <div className="toDoBtn">
                <button onClick={() => handleDelete(toDo.id)}>
                  <img src={trash}></img>
                </button>
                <button onClick={""}>
                  <img src={done}></img>
                </button>
              </div>
            </div>
          ))) }
      </div>
    </div>
  );
};

export default Crud;
