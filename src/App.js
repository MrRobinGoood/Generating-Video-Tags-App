import React, { useState, useRef } from "react"
import "./App.css"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Button } from 'primereact/button'
import { InputTextarea } from "primereact/inputtextarea"
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import axios from 'axios';

function App() {
  
  const [ description, setDescription ] = useState("")
  const [ videoTitle, setVideoTitle ] = useState("")
  const [ uploadedFile, setUploadedFile ] = useState([])
  const [ placeholderText, setPlaceholderText ] = useState("Введите описание видео здесь...");
  const [ titleText, setTitleText ] = useState("Введите название видео здесь...")
  const [ loading, setLoading ] = useState(false)
  const [ type, setType ] = useState("")

  const toastRef = useRef(null)
  const inputRef = useRef(null);


  const handleUploadError = (error) => {
    console.error("Error uploading file:", error);
    toastRef.current.show({
      severity: 'error',
      summary: 'Ошибка загрузки',
      detail: 'Произошла ошибка при загрузке видео. Пожалуйста, попробуйте еще раз.',
      life: 3000,
    });
  };

  const handleUploadSuccess = () => {
    toastRef.current.show({
      severity: 'success',
      summary: 'Успешная загрузка',
      detail: 'Видео успешно отправлено на обработку!',
      life: 3000,
    });
  };
  

  const handleChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files);
    setUploadedFile(newFiles)
}




  const load = async () => {

    const formData = new FormData();

    formData.append("description", description);
    formData.append("video_title", videoTitle); 
    formData.append("file", uploadedFile[0]);

    try{
      setLoading(true);
      await axios({
          method: "post",
          url: "http://127.0.0.1:8000/upload_file",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
      }).then(response =>{
            setType(response.data)
            
            handleUploadSuccess()
          }
      )
    } catch (error){
      handleUploadError(error);
      console.log(error)
    } finally {
    setLoading(false);
    }

  }

  return (
    <div className="App">
    <div className="container">
      <div className="content">
        <div className="input-container">
          <InputTextarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder={placeholderText}
            value={description}
            onFocus={() => setPlaceholderText("")}
            onBlur={() => setPlaceholderText(placeholderText ? "" : "Введите описание видео здесь...")} 
            rows={8} 
            cols={30} 
          />
          <InputText 
              value={videoTitle} 
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder={titleText}
              onFocus={() => setTitleText("")}
              onBlur={() => setTitleText(titleText ? "" : "Введите название видео здесь...")}
          />
          <input ref={inputRef} type="file" onChange={handleChange} multiple={false} className="p-inputtext"/>
        </div>
        <div className="button-container">
          <Button label="Отправить на обработку" icon="pi pi-check" loading={loading} onClick={load}/>
        </div>
        <h1 className="h1">{type}</h1>
      </div>
    </div>
    <Toast ref={toastRef} position="top-center"/>
  </div>
  );
}

export default App;
