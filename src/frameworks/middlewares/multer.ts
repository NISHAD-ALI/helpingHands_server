import multer,{Multer} from 'multer';
import path from 'path'
import { Request } from 'express';

const storage = multer.diskStorage({
    destination:function(req:Request,file:Express.Multer.File,cb){
        cb(null,path.join(__dirname,'../../public'));
        
    },
    filename:function(req:Request,file:Express.Multer.File,cb){
        const name = Date.now()+'-'+file.originalname;
        console.log('image uploaded')
        cb(null,name);
    }
    
})

export const uploadFile = multer({storage:storage});
