import { useState } from "react";
import '../../styles/css/forgot-style.css';
import { useNavigate } from 'react-router-dom'

const Forgot = () => {
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
      info: "",
      newpassword: "",
      confirmnewpassword: "",
   });
   const [msg, setMsg] = useState({
      errorEmpty: "",
      errorEmail: "",
      errorMatchPwd: "",
      successReset:""
   });
   const handleForgotChange = (e: any) => {
      const { name, value } = e.target;
      setFormData((formDataObj) => ({ ...formDataObj, [name]: value }));
   };
   const handleSubmitForgot = async (e: any) => {
      e.preventDefault();
      await sendRequestForgot();
   };
   async function sendRequestForgot() {
      const { info, newpassword, confirmnewpassword } = formData;
      if (
         info === "" ||
         newpassword === "" ||
         confirmnewpassword === ""
      ) {
         setMsg((msgObj) => ({
         ...msgObj,
         errorEmpty: "Please fill in all fields and try again.",
         }));
         setTimeout(() => {
         setMsg((msgObj) => ({ ...msgObj, errorEmpty: "" }));
         }, 3000);
         return;
      }
      if (newpassword !== confirmnewpassword) {
         setMsg((msgObj) => ({
         ...msgObj,
         errorMatchPwd: "Passwords do not match.",
         }));
         setTimeout(() => {
         setMsg((msgObj) => ({ ...msgObj, errorMatchPwd: "" }));
         }, 3000);
         return;
      }
      try {
         const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/forgot`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ info, newpassword, confirmnewpassword }),
         });
         const data = await response.json();
         
         if(data.errorEmail){
         				
         setMsg((msgObj)=>({...msgObj, errorEmail:data.errorEmail}))
         setTimeout(()=>{
            setMsg((msgObj)=>({...msgObj, errorEmail:''}))
         },3000)
         }
         if(data.successReset){
         console.log(`data.successReset: `, data.successReset)
         setMsg((msgObj)=>({...msgObj, successReset:data.successReset}))
         setTimeout(()=>{
            setMsg((msgObj)=>({...msgObj, successReset:''}))
            navigate('/auth/login')
         },2000)
         } 
      } catch (error) {
         console.error("Error in sendRequestForgot: ", error);
      }
      
  }
  return (
    <div className="forgot-container">
      <h1 className="mb-4">Reset Password</h1>
      <div className="forgot-form">
        {msg.errorEmpty && <div className="text-danger">{msg.errorEmpty}</div>}
        {msg.errorEmail && <div className="text-danger">{msg.errorEmail}</div>}
        {msg.errorMatchPwd && (
          <div className="text-danger">{msg.errorMatchPwd}</div>
        )}
        {msg.successReset && (
          <div className="text-success">{msg.successReset}</div>
        )}
        <form action="/auth/forgot" method="POST" onSubmit={handleSubmitForgot}>
          <div className="mt-5">
            <label htmlFor="info" className="form-label">
              Enter email or username:
            </label>
            <input
              onChange={(e) => handleForgotChange(e)}
              type="text"
              id="info"
              name="info"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="newpassword" className="form-label">
              New Password:
            </label>
            <input
              onChange={(e) => handleForgotChange(e)}
              type="password"
              name="newpassword"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="newpassword" className="form-label">
              Confirm Password:
            </label>
            <input
              onChange={(e) => handleForgotChange(e)}
              type="password"
              name="confirmnewpassword"
              className="form-input"
            />
          </div>
          <div className="my-2 form-btn">
            <button type="submit" className="reset-btn">Reset Password</button>
          </div>
        </form>
      </div>
     
    </div>
  );
};
export default Forgot;
