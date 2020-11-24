import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
//const { Token } = models;
dotenv.config();

/**
 * This class contains.
 */
class TokenHelper {
  /**
   * Hashs the password.
   * @param {string} password The user's password.
   * @returns {string} The users's hashed password.
   */
  static generateToken(user, sk) {
    const {id,username,role} = user
    const secrect = sk;
    return jwt.sign({id,username,role}, secrect, { expiresIn: 3600 });
  }


  /**
   * Hashs the password.
   * @param {string} token The user's token.
   * @param {string} secrectKey The secret key.
   * @returns {string} The users's hashed password.
   */
  static decodeToken(token, sk) {
    const userData = jwt.verify(token, sk);
    return userData;
  }

  /**
   * Hashs the password for signup and login response.
   * @param {integer} id The user's id.
   * @param {string} username The user's username.
   * @param {string} email The user's email.
   * @param {string} role The user's role.
   * @param {string} isVerified The user's isVerified.
   * @returns {string} The users's hashed password.
   */
//   static async generateTokenB(id, username, email, role, isVerified) {
//     const userTokenExists = await Token.findOne({ where: { userId: id } });
//     if (userTokenExists) {
//       return userTokenExists.value;
//     }
//     const generatedToken = jwt.sign({
//       id, username, email, role, isVerified
//     }, process.env.SECRET_KEY);
//     importInsertToken.insertGeneratedToken(generatedToken, id);
//     return generatedToken;
//   }
}
export default TokenHelper;
