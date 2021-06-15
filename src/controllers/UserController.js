import NodeCache from 'node-cache';
import { resolve } from 'path';
import { encryptedPwd, comparePwd } from '../utils/PasswordUtils';
import { generateToken } from '../utils/RandomToken';
import SendMailService from '../modules/mail/SendMailService';

const cacheUser = new NodeCache({ stdTTL: 0, checkperiod: 0 });

export async function sendMailWithTokenOfAuth(req, res) {
    const { email } = req.body;
    const tokenAuth = generateToken();
    const templatePath = resolve(__dirname, "..", "templates", "Token.hbs");

    const variables = { tokenAuth };

    const sendMailWithToken = await SendMailService.execute(email, 'Token',
        variables, templatePath);

    const pwdUser = cacheUser.take(email);

    const valueUser = { tokenAuth, pwdUser };

    cacheUser.set(email, valueUser);

    return res.json({ msg: "Token enviado para e-mail.", link: sendMailWithToken });

}

export async function auth(req, res) {
    const { mail, password, token } = req.body;
    const { tokenAuth, pwdUser } = cacheUser.get(mail);

    const passwordIsNotEquals = !(await comparePwd(password, pwdUser));

    if (passwordIsNotEquals || token !== tokenAuth) {
        return res.status(401).send("Acesso negado.");
    }

    return res.json({ msg: "Acesso permitido." });
}

export async function createUser(req, res) {
    const { mail, password } = req.body;

    try {
        const pwd = await encryptedPwd(password);
        cacheUser.set(mail, pwd);
        
        return res.json({ msg: "usuário criado." });
    } catch (e) {
        console.error(e);
        return res.status(400).send("Erro");
    }

}