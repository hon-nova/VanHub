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
    const imageDir = path.join(__dirname,'../../../backend/src/images')
    
    const imagePath = path.join(imageDir,`${userId}-${Date.now()}.png`)
    console.log(`IMPORTANT`)
    console.log(`userId in saveAvatarToDisk:`, userId);

    // ensure the directory exists
    if(!fs.existsSync(imageDir)){
      fs.mkdirSync(imageDir,{recursive:true})
    }
    // fetch the image and save to disk
    const response = await axios.get(imageUrl, {responseType: "arraybuffer"})
    console.log(`data in saveAvatarToDisk: `, response.data)//Buffer
    fs.writeFileSync(imagePath, response.data)
    return imagePath
  } catch(error){
    if(error instanceof Error){
      console.error('saveAvatarToDisk - Error:',error.message);
    }
    return ''
  }
}
// Upload file using standard upload
// const avatar = data[0].url
// const file = `https://supabase.com/dashboard/project/pvvdexpxtesuyjnodslj/storage/buckets/avatars/${avatar}`
// async function uploadFile(file:File,userId:string):Promise<void>{ 
//   const file_path = `https://supabase.com/dashboard/project/pvvdexpxtesuyjnodslj/storage/buckets/avatars/`

//   const { data, error } = await supabase.storage.from('avatars').upload(file_path, file,{ contentType: 'image/jpeg'})
//   if (error) {
//     // Handle error
//     console.log('uploadFile - Error:', error);
//   } else {
//     // Handle success
//     console.log('uploadFile - Success:', data);
//   }
// }
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
    //!important, return the public URL of the uploaded file
    console.log(`data in uploadFile: `, data)
    const { data: publicUrlData} = supabase.storage.from('avatars').getPublicUrl(filePath)
    console.log(`publicUrlData in uploadFile: `, publicUrlData)
    console.log(`typeof publicUrlData.publicUrl in uploadFile: `, typeof publicUrlData?.publicUrl)
    // return data?.publicUrl
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

  console.log('User avatar updated successfully:', data);
  
  } catch(error){
    if(error instanceof Error){
      console.error('saveUserAvatar - Error:',error.message);
    }
  }
  
}

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPEN_ACCESS_KEY });
async function handleAvatarGeneration(description: string, userId: string): Promise<void> {
  console.log(`IMPORTANT IN handleAvatarGeneration`)
  console.log(`userId: `, userId)
  try {
    const image = await openai.images.generate({
      model: "dall-e-2",
      prompt: description,
      size: "256x256",
      style: "natural"
    });

    const avatarUrl = image.data[0].url;
    console.log(`OpenAI avatar: `, avatarUrl);
    if (!avatarUrl) {
      throw new Error('Failed to generate avatar.');
    }
    // Save avatar to disk
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
(async()=>{
  // const avatar = saveAvatarToDisk('https://oaidalleapiprodscus.blob.core.windows.net/private/org-RITs8FNPgNEteFFQNsd2R4xP/user-dw9rR9SPiM1og9ZohYAtF9vv/img-6plTWR7F6BNKBd9OLO3jlkli.png?st=2024-12-13T04%3A43%3A03Z&se=2024-12-13T06%3A43%3A03Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-12-13T04%3A01%3A07Z&ske=2024-12-14T04%3A01%3A07Z&sks=b&skv=2024-08-04&sig=bZbisNLXGkAXjqq89k4kKW%2Bb1ZhVMLJGblHuZzm/GdU%3D','44cf8405-b28d-4d59-a427-79d32add0161')
  // await handleAvatarGeneration('A happy female coder', '44cf8405-b28d-4d59-a427-79d32add0161')
  const pathIn = path.join(__dirname,'../../../backend/src/images')
console.log(`pathIn in userController: `, pathIn)
})()
const pathIn = path.join(__dirname,'../../../backend/src/images')
// console.log(`pathIn in userController: `, pathIn)
async function readAvatarsFromDisk(userId:string):Promise<User|null>{
  try {
    const pathIn = path.join(__dirname,'../../../backend/src/images')
    const files = await fss.readdir(pathIn)
    console.log(`files in readAvatarsFromDisk: `, files)
    const userAvatar = files.find((file)=>file.includes(userId))
    // console.log(`userAvatar in readAvatarsFromDisk: `, userAvatar)
    if(!userAvatar){
      // console.log(`path.join(pathIn,userAvatar) in readAvatarsFromDisk: `, path.join(pathIn,userAvatar))
      return null
    }   
    console.log(`userAvatar: `,userAvatar)
      const updatedUser = await updateUser(userId,{avatar:userAvatar})
      console.log(`IMPORTANT updatedUser in readAvatarsFromDisk: `)
      console.log(updatedUser)
      return updatedUser 

  } catch(error){
    if(error instanceof Error){
      console.error('readAvatarFromDisk - Error:',error.message);
    }
    return null
  }
}
readAvatarsFromDisk('c338f528-d10c-4b85-9490-64a03da91133')
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
      // console.log(`getUserByUname - User not found:`, uname);
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
      // console.log('getUserByEmail - User not found:', email);
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
(async ()=>{
  // const urlString='https://randomuser.me/api/portraits/men/78.jpg'
  // const blob = await fetchImageAsBlob(urlString)
  // // console.log(`blob in userController: `, blob)
  // // signature: uploadFile(blob:Blob,userId:string)
  // const userId="ac4c9fe6-2652-4612-888a-d5f014d20381"
  // const publicUrl = await uploadFile(blob!,userId)
  // console.log(`publicUrl in userController: `, publicUrl)
})()

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
  readAvatarsFromDisk
};
