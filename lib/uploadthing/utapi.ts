import { UTApi, UTFile } from 'uploadthing/server';

export const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
export const utFile = UTFile;