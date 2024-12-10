import { supabase } from '../db/supabaseClient';
import { User } from '../shared/interfaces/index';
import bcrypt from 'bcrypt';

const saltValue = 8;

async function addUser(uname: string, email: string, password: string|'', avatar: string|''): Promise<User | null> {
  try {
    const hashedPassword = bcrypt.hashSync(password, saltValue);
    const { data, error } = await supabase
      .from('users')
      .insert([{ uname, email, password: hashedPassword, avatar }])
		.select("*")
		.single();

    if (error) throw error;

    return data
  } catch (error) {
    console.error('addUser - Error:', error);
    return null;
  }
}

async function updateUser(id: string, changes: { avatar?: string }): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(changes)
      .eq('id', id)
      .select()
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
};
