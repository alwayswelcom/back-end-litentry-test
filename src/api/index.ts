import { Response, Request } from 'express'
import { cryptoWaitReady, decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { jwtAudience, jwtIssuer, jwtSecret}  from '../config';
import jwt   from  'jsonwebtoken';

const apiSecret = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token)
    {
        res.status(201).json({success: false, message: "Error! Token was not provided."});
    }
    //Decoding the token
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
        if(err) {
            res.status(201).json({success: false});
        } else {
            res.status(200).json({success: true, randomMessage: messageGenerator(48)});
        }
    } ); 
}
const apiSignIn = async (req: Request, res: Response): Promise<void> => {
    const { address, message, signature } = req.body;
    await cryptoWaitReady();
    const isValid = isValidSignature(message, signature, address)
    try {
        const { address, message, signature } = req.body;
        await cryptoWaitReady();
        const isValid = isValidSignature(message, signature, address)
        if(isValid) {
           
            res.status(201).json({ access_token: createAccessToken() })  
        }
    } catch (error) {
        res.status(400).json({ errorMessage: "Login Failed", status: false })
    }
}
const isValidSignature = (signedMessage: string, signature: string, address: string) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
  
    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

const tokenCheck = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token)
    {
        res.status(201).json({success: false, message: "Error! Token was not provided."});
    }
    //Decoding the token
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
        if(err) {
            res.status(201).json({success: false});
        } else {
            res.status(200).json({success: true});
        }
    } ); 
}
const createAccessToken = () => {
    return jwt.sign({
      iss: jwtIssuer,
      aud: jwtAudience,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      scope: 'full_access',
      sub: "lalaland|gonto",
      jti: genJti(), // unique identifier for the token
      alg: 'HS256'
    }, jwtSecret);
  }

const genJti = () => {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return jti;
}
const messageGenerator = (length: number) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export { apiSecret, apiSignIn, tokenCheck }
