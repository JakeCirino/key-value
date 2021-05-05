import { Controller, Delete, Get, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { PlainBody } from 'src/plainbody.decorator';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
    constructor(private storeService: StoreService){}
    
    @Put(':key')
    setKeyValue(@Res({passthrough: true}) res: Response, @Param('key') key: string, @PlainBody() value: string){
        //no data provided
        if(key.length == 0 || value.length == 0){
            res.status(HttpStatus.NOT_ACCEPTABLE);
            return;
        }
        
        this.storeService.put(key, value)
        .then(result => {
            res.status(result ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR);
            return;
        })
    }
    
    @Get(':key')
    async getKeyValue(@Res({passthrough: true}) res: Response, @Param('key') key: string): Promise<String>{
        if(key.length == 0){
            res.status(HttpStatus.NOT_ACCEPTABLE);
            return '';
        }

        let result: any = await this.storeService.get(key);
        if(result === undefined){
            res.status(HttpStatus.NOT_FOUND);
            return '';
        }

        return result;
    }

    @Delete(':key')
    deleteKeyValue(@Res({passthrough: true}) res: Response, @Param('key') key: string){
        //no data provided
        if(key.length == 0){
            res.status(HttpStatus.NOT_ACCEPTABLE);
            return;
        }

        this.storeService.delete(key)
        .then(result => {
            res.status(result ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR);
            return;
        })
    }

}
