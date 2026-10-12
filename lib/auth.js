import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.SESSION_SECRET;

if(!secret){
    throw new Error("SESSION_SECRET is missing");
}

const key = new TextEncoder().encode(secret);


// jwt token create
export async function createToken(payload){
    return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

// jwt token verify
export async function verifyToken(token){
    const payload = await jwtVerify(token, key, {
        algorithms: ['HS256'],
    });

    return payload;
}

// read login token from cookie
export async function getCurrentUser(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if(!token){
        return null;
    }

    try{
        return await verifyToken(token);
    } catch{
        return null;
    }
}