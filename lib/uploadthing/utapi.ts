import { UTApi, UTFile } from 'uploadthing/server';

export const utapi = new UTApi({ apiUrl: process.env.UPLOADTHING_SECRET });
export const utFile = UTFile;