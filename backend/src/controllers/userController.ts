import { supabase } from '../db/supabaseClient';
import { User } from '../shared/interfaces/index';
import bcrypt from 'bcrypt';
import axios from 'axios';

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

    // Fetch image as Blob
    const imageBlob = await fetchImageAsBlob(avatarUrl) as Blob;

    // Upload Blob to Supabase
    const uploadedUrl = await uploadFile(imageBlob, userId);
    if (!uploadedUrl) {
      throw new Error('Failed to upload avatar to Supabase.');
    }

    // Save avatar URL to user's profile
    await saveUserAvatar(userId, uploadedUrl);   
    
  } catch (error) {
    if (error instanceof Error){
      console.error('Error in handleAvatarGeneration:', error.message);
    }    
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
  handleAvatarGeneration
};
