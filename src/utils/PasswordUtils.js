import { hash, compare } from 'bcrypt';
const saltRounds = Math.floor(Math.random() * 12);

export const encryptedPwd = async (pwd) => {
    return await hash(pwd, saltRounds);
}

export const comparePwd = async (passwordUser, passwordCache) => {
    return await compare(passwordUser, passwordCache);
}