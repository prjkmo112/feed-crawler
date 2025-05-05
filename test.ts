import crypto from 'crypto';
import base32Encode from 'base32-encode';


// const buf = crypto.randomBytes(16);
const buf = Buffer.from('0000 0000 0000 0000'.replaceAll(" ", ""), 'utf-8');
const encoded = base32Encode(buf, 'RFC4648', { padding: false });
console.log(encoded); // prints a base32 encoded string