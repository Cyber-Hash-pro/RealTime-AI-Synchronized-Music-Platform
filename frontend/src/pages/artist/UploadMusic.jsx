import React from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
function UploadMusic() {
    const {register,reset,handleSubmit}= useForm()
    const formData=(data)=>{



        const formData = new FormData();
formData.append("title", data.title);
formData.append("music", data.music[0]);
formData.append("coverImage", data.coverImage[0]);
        // console.log(data);
        axios.post('http://localhost:3002/api/music/upload',formData,{withCredentials:true})
        .then((res)=>{
            console.log(res.data);
            reset()
        })
        .catch((err)=>{
            console.log(err);
        })
    }
  return (
    <div>UploadMusic
       <form action="" onSubmit={handleSubmit(formData)}>
          <input type="text"  {...register("title")} />
          <input type="file" accept='audio/*' {...register("music")} />
          <input type="file" accept='image/*' {...register("coverImage")} />
          <button  style={{
            background:'red',
            padding:'20px'
          }}>Submit Data</button>
       </form>
    </div>
  )
}

export default UploadMusic