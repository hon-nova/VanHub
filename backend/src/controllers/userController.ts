import { supabase } from '../db/supabaseClient';
import { User } from '../shared/interfaces/index';
import bcrypt from 'bcrypt';
import axios from 'axios';
import path from 'path';
import fs from 'fs'
import fss from 'node:fs/promises'

const saltValue = 8;

async function addUser(uname: string, email: string, password: string|'', avatar: string|''): Promise<User | null> {
  try {
    const hashedPassword = bcrypt.hashSync(password, saltValue);
    const { data, error } = await supabase
      .from('users')
      .insert([{ uname, email, password:hashedPassword, avatar }])
      .select("*")
      .single();

    if (error) throw error;
    return data
  } catch (error) {
    console.error('addUser - Error:', error);
    return null;
  }
}

async function saveAvatarToDisk(imageUrl:string,userId:string):Promise<string>{
  try {    
    const imageDir = path.join(__dirname,'../../../backend/src/avatars')
    
    const imagePath = path.join(imageDir,`${userId}-${Date.now()}.png`)
    
    if(!fs.existsSync(imageDir)){
      fs.mkdirSync(imageDir,{recursive:true})
    }
   
    const response = await axios.get(imageUrl, {responseType: "arraybuffer"})
    
    fs.writeFileSync(imagePath, response.data)
    return imagePath
  } catch(error){
    if(error instanceof Error){
      console.error('saveAvatarToDisk - Error:',error.message);
    }
    return ''
  }
}

async function fetchImageAsBlob(imageUrl:string):Promise<Blob|undefined>{
  try{
    const response = await fetch(imageUrl)
    if(!response.ok){
      throw new Error(`Failed to fetch image from ${imageUrl}`)
    }
    return await response.blob()
  } catch(error){
    if(error instanceof Error){
      console.error('CATCH fetchImageAsBlob - Error:',error.message);
      return undefined
    }  
  } 
}
async function uploadFile(blob:Blob,userId:string):Promise<string|undefined>{
  try {
    const filePath=`https://supabase.com/dashboard/project/pvvdexpxtesuyjnodslj/storage/buckets/avatars/${userId}-${Date.now()}.png`
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath,blob,{ upsert: true, contentType: 'image/png'})

    if(error) throw new Error(`Upload failed ${error.message}`)
   
    const { data: publicUrlData} = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    return publicUrlData?.publicUrl
    
  } catch(error){
    if(error instanceof Error){
      console.error('CATCH uploadFile - Error:',error.message);
      return ''
    }
  }
}
async function saveUserAvatar(userId: string, avatarUrl: string): Promise<void> {
  try {
    const { data, error } = await supabase
    .from('users')
    .update({ avatar: avatarUrl })
    .eq('id', userId)


  if (error) {
    console.error('Error updating user avatar:', error.message);
    throw new Error('Failed to update user avatar.');
  }
  
  } catch(error){
    if(error instanceof Error){
      console.error('saveUserAvatar - Error:',error.message);
    }
  }  
}

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPEN_ACCESS_KEY });

async function handleAvatarGeneration(description: string, userId: string): Promise<void> {
  
  try {
    const image = await openai.images.generate({
      model: "dall-e-2",
      prompt: description,
      size: "256x256",
      style: "natural"
    });

    const avatarUrl = image.data[0].url;
    
    if (!avatarUrl) {
      throw new Error('Failed to generate avatar.');
    }
    
    const imagePath = await saveAvatarToDisk(avatarUrl, userId);
    
    if(imagePath){
      console.log(`SUCCESS SAVED IMAGED ON DISK`)
    } else {
      throw new Error('Failed to save image on disk')
    }
    
  } catch (error) {
    if (error instanceof Error){
      console.error('Error in handleAvatarGeneration:', error.message);
    }    
  }
}

async function uploadAvatarToSupabase(userId: string):Promise<User|null> {
  try {
   const pathIn=path.join(__dirname,'../../../backend/src/avatars')
  
   const fileOrigin= await fss.readdir(pathIn)
   const filePath = path.join(pathIn,fileOrigin[0])
  //  console.log( `FIRST IMPORTANT `)
  //  console.log(`filePath in uploadAvatarToSupabase: `, filePath)

   const fileBuffer = fs.readFileSync(filePath)
   const fileName = path.basename(filePath)
  //  console.log(`fileName in uploadAvatarToSupabase: `, fileName)

   //upload avatar to supabase
   const { data,error}= await supabase.storage.from('images').upload(fileName,fileBuffer, {contentType: 'image/png'})
   if(error){
      console.log('uploadAvatarToSupabase - Error:', error.message);
      throw new Error('Failed to upload avatar to Supabase.');
      
   }
  //  console.log(`IMPORTANT-1`)
  //  console.log(`SUCCESS-1 File uploaded as: `, data.path)
   // generate a public URL for the uploaded file

   const { data: publicUrlData} = supabase.storage.from('images').getPublicUrl(data.path)

   if(publicUrlData){      
      console.log(`SUCCESS-2 public URL: `, publicUrlData?.publicUrl)     
   }   

   const updatedUser = await updateUser(userId,{avatar:publicUrlData?.publicUrl})
   console.log(`IMPORTANT updatedUser in uploadAvatarToSupabase: `)
   console.log(updatedUser)
   
   
   fs.unlinkSync(filePath)
   return updatedUser  

  } catch(error){
    if(error instanceof Error){
      console.error('CATCH: uploadAvatarToSupabase - Error:',error.message);
    }
    return null
  }  
}

async function readAvatarsFromDisk(userId:string):Promise<User|null>{
  try {
    const pathIn = path.join(__dirname,'../../../backend/src/avatar')
    const files = await fss.readdir(pathIn)
   
    const userAvatar = files.find((file)=>file.includes(userId))
    
    if(!userAvatar){
      
      return null
    }   
    console.log(`userAvatar: `,userAvatar)
      const updatedUser = await updateUser(userId,{avatar:userAvatar})
      
      return updatedUser 

  } catch(error){
    if(error instanceof Error){
      console.error('readAvatarFromDisk - Error:',error.message);
    }
    return null
  }
}


async function updateUser(id: string, changes: { avatar?: string }): Promise<User | null> {
  try {
    const { avatar } = changes;
    const { data, error } = await supabase
      .from('users')
      .update({ avatar})
      .eq('id', id)
      .select("*")
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('updateUser - Error:', error);
    return null;
  }
}

async function getUsers(): Promise<User[] | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('getUsers - Error:', error);
    return null;
  }
}

async function getUserById(userid: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userid)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('getUserById - Error:', error);
    return null;
  }
}

async function getUserByUname(uname: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('uname', uname)
      .single();

    if (error) {
      
      return null;
    }

    return data;
  } catch (error) {
    console.error('getUserByUname - Error:', error);
    return null;
  }
}

async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      
      return null;
    }

    return data;
  } catch (error) {
    console.error('getUserByEmail - Error:', error);
    return null;
  }
}

function isUserValid(user: User, password: string) {
  return bcrypt.compareSync(password, user.password);
}

async function getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email);
    console.log('Retrieved user from getUserByEmailAndPassword:', user);

    if (!user || !user.password) {
      throw new Error(`No such user/email`);
    }

    const isPwdValid = bcrypt.compareSync(password, user.password);
    if (isPwdValid) {
      return user;
    } else {
      throw new Error(`Password is incorrect`);
    }
  } catch (error) {
    console.error('getUserByEmailAndPassword - Error:', error);
    return null;
  }
}

async function getUserByUnameOrEmail(uname: string, email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .or(`uname.eq.${uname},email.eq.${email}`)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('getUserByUnameOrEmail - Error:', error);
    return null;
  }
}

async function resetPassword(info: string, newbarepassword: string): Promise<User | null> {
  try {
    const user = (await getUserByEmail(info)) || (await getUserByUname(info));

    if (!user) {
      throw new Error(`Couldn't find user with ${info}`);
    }

    const hashedPassword = bcrypt.hashSync(newbarepassword, saltValue);

    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('resetPassword - Error:', error);
    return null;
  }
}


export {
  getUsers,
  getUserById,
  getUserByUname,
  resetPassword,
  getUserByEmailAndPassword,
  getUserByEmail,
  isUserValid,
  addUser,
  getUserByUnameOrEmail,
  updateUser,
  fetchImageAsBlob,
  uploadFile,
  handleAvatarGeneration,
  saveAvatarToDisk,
  readAvatarsFromDisk,
  uploadAvatarToSupabase
};
